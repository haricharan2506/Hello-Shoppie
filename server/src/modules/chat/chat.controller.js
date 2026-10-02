const { chatWithAI } = require("./chat.service");

const sendChatMessage = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required",
            });
        }

        const stream = await chatWithAI({
            messages,
        });

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );
        res.setHeader(
            "Cache-Control",
            "no-cache"
        );
        res.setHeader(
            "Connection",
            "keep-alive"
        );

        let buffer = "";

        stream.on("data", (chunk) => {
            buffer += chunk.toString();

            // Gemini SSE events are separated by blank lines.
            const events = buffer.split("\n\n");

            // Keep the incomplete event for the next chunk.
            buffer = events.pop() || "";

            for (const event of events) {
                const lines = event.split("\n");

                for (const line of lines) {
                    const trimmedLine = line.trim();

                    if (!trimmedLine.startsWith("data:")) {
                        continue;
                    }

                    const data = trimmedLine.replace(
                        /^data:\s*/,
                        ""
                    );

                    if (!data || data === "[DONE]") {
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(data);

                        const text =
                            parsed.candidates?.[0]
                                ?.content?.parts
                                ?.map((part) => part.text || "")
                                .join("") || "";

                        if (text) {
                            res.write(text);
                        }
                    } catch (parseError) {
                        console.error(
                            "Gemini SSE Parse Error:",
                            parseError.message
                        );
                    }
                }
            }
        });

        stream.on("end", () => {
            // Process any final buffered event.
            if (buffer.trim()) {
                const lines = buffer.split("\n");

                for (const line of lines) {
                    const trimmedLine = line.trim();

                    if (!trimmedLine.startsWith("data:")) {
                        continue;
                    }

                    const data = trimmedLine.replace(
                        /^data:\s*/,
                        ""
                    );

                    if (!data || data === "[DONE]") {
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(data);

                        const text =
                            parsed.candidates?.[0]
                                ?.content?.parts
                                ?.map((part) => part.text || "")
                                .join("") || "";

                        if (text) {
                            res.write(text);
                        }
                    } catch (parseError) {
                        console.error(
                            "Final Gemini SSE Parse Error:",
                            parseError.message
                        );
                    }
                }
            }

            res.end();
        });

        stream.on("error", (error) => {
            console.error(
                "Gemini Stream Error:",
                error
            );

            if (!res.headersSent) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to stream AI response",
                });
            }

            res.end();
        });
    } catch (error) {
        console.error(
            "Chat Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get AI response",
        });
    }
};

module.exports = {
    sendChatMessage,
};