const axios = require("axios");

const { searchProducts } = require("./chat.tools");

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Detect whether the latest user message is asking
 * about finding/searching for a product.
 */
const isProductSearchQuery = (text = "") => {
    const normalized = text.toLowerCase().trim();

    if (!normalized) {
        return false;
    }

    const nonSearchMessages = [
        "hi",
        "hello",
        "hey",
        "thanks",
        "thank you",
        "thx",
        "ok",
        "okay",
        "yes",
        "yeah",
        "yep",
        "sure",
        "fine",
        "great",
        "good",
        "no",
        "nope",
        "bye",
        "got it",
        "cool",
        "nice",
        "got any",
        "any?",
        "anything?",
    ];

    if (nonSearchMessages.includes(normalized)) {
        return false;
    }

    const searchPatterns = [
        /\bfind\b/,
        /\bsearch\b/,
        /\blooking for\b/,
        /\bshow me\b/,
        /\bdo you have\b/,
        /\bavailable\b/,
        /\bwhere can i buy\b/,
        /\bwhere can i get\b/,
        /\bi want\b/,
        /\bi need\b/,
        /\bcan you find\b/,
        /\bhelp me find\b/,
        /\blooking to buy\b/,
        /\bshop for\b/,
        /\bbuy\b/,
        /\bpurchase\b/,
    ];

    if (
        searchPatterns.some((pattern) =>
            pattern.test(normalized)
        )
    ) {
        return true;
    }

    const productTerms = [
        "tablet",
        "tablets",
        "laptop",
        "laptops",
        "phone",
        "phones",
        "mobile",
        "mobiles",
        "smartphone",
        "smartphones",
        "tv",
        "television",
        "televisions",
        "monitor",
        "monitors",
        "keyboard",
        "keyboards",
        "mouse",
        "mice",
        "headphone",
        "headphones",
        "earphone",
        "earphones",
        "earbuds",
        "speaker",
        "speakers",
        "camera",
        "cameras",
        "watch",
        "watches",
        "shoes",
        "shoe",
        "shirt",
        "shirts",
        "dress",
        "dresses",
        "bag",
        "bags",
        "backpack",
        "backpacks",
        "jacket",
        "jackets",
        "book",
        "books",
        "soya sauce",
        "soy sauce",
        "sauce",
        "groceries",
        "grocery",
        "electronics",
    ];

    return productTerms.some((term) =>
        normalized.includes(term)
    );
};

const MAX_PRICE_PATTERN =
    /\b(?:under|below|less than|upto|up to|within|max(?:imum)?)\b\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i;

const MIN_PRICE_PATTERN =
    /\b(?:above|over|more than|starting (?:at|from)|min(?:imum)?)\b\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i;

const extractMaxPrice = (text = "") => {
    const match = text.match(MAX_PRICE_PATTERN);

    if (!match) {
        return undefined;
    }

    return Number(match[1].replace(/,/g, ""));
};

const extractMinPrice = (text = "") => {
    const match = text.match(MIN_PRICE_PATTERN);

    if (!match) {
        return undefined;
    }

    return Number(match[1].replace(/,/g, ""));
};

const detectSortPreference = (text = "") => {
    const normalized = text.toLowerCase();

    if (
        /\b(cheapest|lowest price|low to high|price low)\b/.test(
            normalized
        )
    ) {
        return "price_asc";
    }

    if (
        /\b(most expensive|highest price|high to low|price high)\b/.test(
            normalized
        )
    ) {
        return "price_desc";
    }

    if (/\boldest\b/.test(normalized)) {
        return "oldest";
    }

    return "newest";
};

const extractProductQuery = (text = "") => {
    let query = text.toLowerCase().trim();

    query = query.replace(
        new RegExp(MAX_PRICE_PATTERN.source, "gi"),
        ""
    );

    query = query.replace(
        new RegExp(MIN_PRICE_PATTERN.source, "gi"),
        ""
    );

    const prefixes = [
        /^can you find me\s+/i,
        /^can you find\s+/i,

        /^could you find me\s+/i,
        /^could you find\s+/i,

        /^please find me\s+/i,
        /^please find\s+/i,

        /^help me find\s+/i,

        /^can you search for\s+/i,
        /^could you search for\s+/i,
        /^please search for\s+/i,
        /^help me search for\s+/i,

        /^can you get me\s+/i,
        /^could you get me\s+/i,
        /^get me\s+/i,

        /^find me\s+/i,
        /^find\s+/i,

        /^i am looking for\s+/i,
        /^i'm looking for\s+/i,

        /^i am looking to buy\s+/i,
        /^i'm looking to buy\s+/i,

        /^i want to buy\s+/i,
        /^i want\s+/i,

        /^i need\s+/i,

        /^show me\s+/i,

        /^do you have\s+/i,

        /^where can i buy\s+/i,

        /^search for\s+/i,
        /^search\s+/i,

        /^buy\s+/i,

        /^looking for\s+/i,
    ];

    for (const prefix of prefixes) {
        query = query.replace(prefix, "");
    }

    const suffixes = [
        /\s+for me$/i,
        /\s+please$/i,
        /\s+for us$/i,
        /\s+for myself$/i,
        /\s+available\??$/i,
        /\s+in stock\??$/i,
    ];

    for (const suffix of suffixes) {
        query = query.replace(suffix, "");
    }

    query = query.replace(/[?!.,]+$/g, "").trim();

    query = query
        .replace(/^(a|an|the)\s+/i, "")
        .trim();

    query = query.replace(/\s{2,}/g, " ").trim();

    return query;
};

/**
 * Search the real catalog and build context for Gemini.
 */
const buildCatalogContext = async (userMessage) => {
    if (!isProductSearchQuery(userMessage)) {
        return "";
    }

    try {
        const maxPrice = extractMaxPrice(userMessage);
        const minPrice = extractMinPrice(userMessage);
        const productQuery =
            extractProductQuery(userMessage);
        const sort = detectSortPreference(userMessage);

        const products = await searchProducts({
            search: productQuery,
            minPrice,
            maxPrice,
            sort,
        });

        if (!products || products.length === 0) {
            return "No matching products were found in the current store catalog.";
        }

        return products
            .map(
                (product, index) =>
                    `${index + 1}. ${product.name}
Price: ₹${product.price}
Stock: ${product.stock}
Category: ${product.category || "Unknown"}
Seller: ${product.seller || "Unknown"}
Description: ${product.description || "No description available"}`
            )
            .join("\n\n");
    } catch (error) {
        console.error(
            "Catalog Search Error:",
            error.message
        );

        return "No matching products were found in the current store catalog.";
    }
};

/**
 * Convert frontend chat messages to Gemini format.
 *
 * Gemini uses "model" instead of "assistant".
 */
const convertMessagesToGemini = (messages = []) => {
    return messages.map((message) => ({
        role:
            message.role === "assistant"
                ? "model"
                : "user",
        parts: [
            {
                text: message.content || "",
            },
        ],
    }));
};

/**
 * Send a streaming chat response through Gemini.
 */
const chatWithAI = async ({ messages }) => {
    try {
        const latestUserMessage =
            [...messages]
                .reverse()
                .find(
                    (message) =>
                        message.role === "user"
                )
                ?.content || "";

        const catalogContext =
            await buildCatalogContext(
                latestUserMessage
            );

        const systemInstruction = `
You are NEXA, the AI shopping assistant for this e-commerce platform.

Your responsibilities:
- Help customers find products
- Help customers compare products
- Answer shopping questions
- Explain product information clearly
- Be concise, friendly, and practical

IMPORTANT RULES:

1. Never invent products.
2. Never invent prices.
3. Never invent stock availability.
4. When real catalog information is provided, use ONLY that information.
5. If matching products are provided, directly tell the customer about those products.
6. Do NOT say you need to search the catalog when the catalog results are already provided.
7. Do NOT ask the customer for a brand, type, or model when matching products are already available.
8. If no matching products are found, say that no matching products were found.
9. Do not claim that an order was placed, changed, cancelled, or shipped unless the backend explicitly provides that information.
10. Keep responses concise, usually 2-5 sentences.
11. When products are available, mention their actual names and prices.
12. Do not claim that you have access to products that are not present in the supplied catalog results.

REAL PRODUCT CATALOG RESULTS:
${catalogContext || "No product search was performed for this message."}
        `.trim();

        const model =
            process.env.GEMINI_MODEL ||
            "gemini-3.5-flash-lite";

        const response = await axios.post(
            `${GEMINI_API_URL}/${model}:streamGenerateContent?alt=sse`,
            {
                systemInstruction: {
                    parts: [
                        {
                            text: systemInstruction,
                        },
                    ],
                },

                contents:
                    convertMessagesToGemini(
                        messages
                    ),

                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                },
            },
            {
                headers: {
                    "x-goog-api-key":
                        process.env.GEMINI_API_KEY,
                    "Content-Type":
                        "application/json",
                },
                responseType: "stream",
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Gemini API Error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            "Failed to get response from AI"
        );
    }
};

module.exports = {
    chatWithAI,
};