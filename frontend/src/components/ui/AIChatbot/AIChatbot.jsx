import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CONFIG = {
    storeName: "NEXA",
    peekMessage: "Hi! Looking for something today? I can help you find it",
    welcomeMessage:
        "Hi! I'm your store assistant. I can help with products, orders, returns, recommendations, and more. What are you looking for?",
    quickReplies: [
        "Track my order",
        "Find a product",
        "Sizing help",
        "Return policy",
    ],
    statusText: "Your Shopping AI assistant",
    peekDelayMs: 1800,
};

let idCounter = 0;
const nextId = () => `${Date.now()}-${idCounter++}`;

const Mascot = ({ className = "" }) => (
    <svg
        className={className}
        viewBox="0 0 80 60"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M28 18 C22 4, 34 -2, 38 10 C40 15, 36 20, 30 22 Z"
            fill="#FFFFFF"
            stroke="#1B1B1B"
            strokeWidth="2.2"
            strokeLinejoin="round"
        />

        <path
            d="M46 20 C50 6, 62 6, 60 18 C59 23, 52 25, 46 22 Z"
            fill="#FFFFFF"
            stroke="#1B1B1B"
            strokeWidth="2.2"
            strokeLinejoin="round"
        />

        <path
            d="M31 16 C28 8, 34 5, 36 12 C37 15, 34 18, 31 16 Z"
            fill="#F4B4C6"
        />

        <ellipse
            cx="40"
            cy="34"
            rx="24"
            ry="20"
            fill="#FFFFFF"
            stroke="#1B1B1B"
            strokeWidth="2.2"
        />

        <ellipse
            cx="24"
            cy="46"
            rx="6"
            ry="5"
            fill="#FFFFFF"
            stroke="#1B1B1B"
            strokeWidth="2"
        />

        <ellipse
            cx="56"
            cy="46"
            rx="6"
            ry="5"
            fill="#FFFFFF"
            stroke="#1B1B1B"
            strokeWidth="2"
        />

        <path
            d="M31 30 q3 -4 6 0"
            stroke="#1B1B1B"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
        />

        <path
            d="M43 30 q3 -4 6 0"
            stroke="#1B1B1B"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
        />

        <circle cx="34" cy="38" r="2.6" fill="#F4B4C6" />
        <circle cx="46" cy="38" r="2.6" fill="#F4B4C6" />

        <path
            d="M38 35 q2 2 4 0"
            stroke="#1B1B1B"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
);

const SendIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
    >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const ChatIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1B1B1B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[26px] h-[26px]"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const CloseIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1B1B1B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[26px] h-[26px]"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPeek, setShowPeek] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowPeek(true);
            }
        }, CONFIG.peekDelayMs);

        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isLoading]);

    const openChat = () => {
        setIsOpen(true);
        setShowPeek(false);

        if (messages.length === 0) {
            setTimeout(() => {
                setMessages([
                    {
                        id: nextId(),
                        role: "assistant",
                        content: CONFIG.welcomeMessage,
                    },
                ]);
            }, 200);
        }

        setTimeout(() => {
            textareaRef.current?.focus();
        }, 300);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const toggleChat = () => {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    const autoResize = () => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(
            textarea.scrollHeight,
            90
        )}px`;
    };

    const sendMessage = async (messageText = input) => {
        const text = messageText.trim();

        if (!text || isLoading) {
            return;
        }

        const userMessage = {
            id: nextId(),
            role: "user",
            content: text,
        };

        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        setIsLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: updatedMessages.map((message) => ({
                        role:
                            message.role === "assistant"
                                ? "assistant"
                                : "user",
                        content: message.content,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Chat request failed: ${response.status}`);
            }

            if (!response.body) {
                throw new Error(
                    "Streaming is not supported by this browser"
                );
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let assistantReply = "";
            const assistantId = nextId();

            // Add an empty assistant message first, then fill it in as chunks arrive
            setMessages((prev) => [
                ...prev,
                {
                    id: assistantId,
                    role: "assistant",
                    content: "",
                },
            ]);

            let pendingText = "";
            let updateTimer = null;

            const flushToUI = () => {
                if (!pendingText) return;

                setMessages((prev) => {
                    const updated = [...prev];
                    const messageIndex = updated.findIndex(
                        (message) => message.id === assistantId
                    );

                    if (messageIndex === -1) {
                        return prev;
                    }

                    updated[messageIndex] = {
                        ...updated[messageIndex],
                        content: assistantReply,
                    };

                    return updated;
                });

                pendingText = "";
            };

            while (true) {
                const { value, done } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, {
                    stream: true,
                });

                assistantReply += chunk;
                pendingText += chunk;

                // Update the UI in smooth batches instead of every tiny chunk
                if (!updateTimer) {
                    updateTimer = setTimeout(() => {
                        flushToUI();
                        updateTimer = null;
                    }, 40);
                }
            }

            // Flush anything remaining at the end
            if (updateTimer) {
                clearTimeout(updateTimer);
                updateTimer = null;
            }

            flushToUI();

            // Fallback in case the stream closed with no content at all
            if (!assistantReply) {
                setMessages((prev) => {
                    const updated = [...prev];
                    const messageIndex = updated.findIndex(
                        (message) => message.id === assistantId
                    );

                    if (messageIndex === -1) {
                        return prev;
                    }

                    updated[messageIndex] = {
                        ...updated[messageIndex],
                        content:
                            "Sorry, I didn't quite catch that. Could you try rephrasing?",
                    };

                    return updated;
                });
            }
        } catch (error) {
            console.error("AI Chatbot Error:", error);

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: nextId(),
                    role: "assistant",
                    content:
                        "I'm having trouble connecting right now. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleQuickReply = (reply) => {
        sendMessage(reply);
    };

    return (
        <>
            <style>{`
                .ai-chatbot-root {
                    font-family: 'Nunito', sans-serif;
                }

                .ai-chatbot-root *,
                .ai-chatbot-root *::before,
                .ai-chatbot-root *::after {
                    box-sizing: border-box;
                }

                .ai-chatbot-panel {
                    position: fixed;
                    bottom: 100px;
                    right: 26px;
                    width: 380px;
                    max-width: calc(100vw - 32px);
                    height: 600px;
                    max-height: calc(100vh - 140px);
                    background: #FBF3E3;
                    border: 2.5px solid #1B1B1B;
                    border-radius: 22px;
                    box-shadow: 6px 6px 0 #1B1B1B;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    z-index: 999998;
                    transform-origin: bottom right;
                    transform: scale(0.85) translateY(16px);
                    opacity: 0;
                    pointer-events: none;
                    transition:
                        transform .32s cubic-bezier(.2,.9,.3,1.1),
                        opacity .24s ease;
                }

                .ai-chatbot-panel.open {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                    pointer-events: auto;
                }

                .ai-chatbot-launcher {
                    position: fixed;
                    bottom: 26px;
                    right: 26px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #FFFFFF;
                    border: 2.5px solid #1B1B1B;
                    cursor: pointer;
                    box-shadow: 4px 4px 0 #1B1B1B;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    transition:
                        transform .25s cubic-bezier(.34,1.56,.64,1),
                        box-shadow .2s ease;
                }

                .ai-chatbot-launcher:hover {
                    transform: translate(-1px,-1px);
                    box-shadow: 6px 6px 0 #1B1B1B;
                }

                .ai-chatbot-launcher:active {
                    transform: translate(2px,2px);
                    box-shadow: 2px 2px 0 #1B1B1B;
                }

                .ai-chatbot-launcher-icon {
                    position: absolute;
                    transition:
                        transform .3s ease,
                        opacity .2s ease;
                }

                .ai-chatbot-launcher-icon.close {
                    opacity: 0;
                    transform: rotate(-45deg) scale(.6);
                }

                .ai-chatbot-launcher.open .chat {
                    opacity: 0;
                    transform: rotate(45deg) scale(.6);
                }

                .ai-chatbot-launcher.open .close {
                    opacity: 1;
                    transform: rotate(0) scale(1);
                }

                .ai-chatbot-peek {
                    position: fixed;
                    bottom: 108px;
                    right: 26px;
                    z-index: 999997;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    opacity: 0;
                    transform: translateY(14px) scale(.92);
                    pointer-events: none;
                    transition:
                        opacity .35s ease,
                        transform .35s cubic-bezier(.34,1.56,.64,1);
                }

                .ai-chatbot-peek.show {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }

                .ai-chatbot-mascot {
                    width: 62px;
                    height: 46px;
                    margin-bottom: -14px;
                    margin-right: 26px;
                    z-index: 2;
                    animation: ai-chatbot-bob 2.6s ease-in-out infinite;
                    filter: drop-shadow(0 2px 0 rgba(0,0,0,.06));
                }

                @keyframes ai-chatbot-bob {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }

                    50% {
                        transform: translateY(-6px) rotate(-3deg);
                    }
                }

                .ai-chatbot-peek-bubble {
                    position: relative;
                    background: #FBF3E3;
                    border: 2.5px solid #1B1B1B;
                    border-radius: 20px;
                    padding: 14px 16px;
                    max-width: 240px;
                    font-size: 14px;
                    line-height: 1.45;
                    color: #1B1B1B;
                    font-weight: 600;
                    box-shadow: 5px 5px 0 #1B1B1B;
                    cursor: pointer;
                }

                .ai-chatbot-header {
                    background: #F5EAD2;
                    border-bottom: 2.5px solid #1B1B1B;
                    color: #1B1B1B;
                    padding: 14px 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }

                .ai-chatbot-header-avatar {
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                }

                .ai-chatbot-header-text {
                    flex: 1;
                    min-width: 0;
                }

                .ai-chatbot-header-name {
                    font-family: 'Quicksand', sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 1.2;
                }

                .ai-chatbot-header-status {
                    font-size: 12px;
                    color: #6B6355;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 3px;
                    font-weight: 600;
                }

                .ai-chatbot-status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #5FAF6E;
                    animation: ai-chatbot-pulse 2s infinite;
                }

                @keyframes ai-chatbot-pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(95,175,110,.55);
                    }

                    70% {
                        box-shadow: 0 0 0 6px rgba(95,175,110,0);
                    }

                    100% {
                        box-shadow: 0 0 0 0 rgba(95,175,110,0);
                    }
                }

                .ai-chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    background: #FBF3E3;
                }

                .ai-chatbot-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .ai-chatbot-messages::-webkit-scrollbar-thumb {
                    background: rgba(27,27,27,.2);
                    border-radius: 10px;
                }

                .ai-chatbot-message {
                    max-width: 78%;
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 14.5px;
                    line-height: 1.45;
                    font-weight: 600;
                    border: 2px solid #1B1B1B;
                    animation: ai-chatbot-message-in .28s cubic-bezier(.2,.9,.3,1.1) both;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                }

                @keyframes ai-chatbot-message-in {
                    from {
                        opacity: 0;
                        transform: translateY(8px) scale(.98);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .ai-chatbot-message.bot {
                    align-self: flex-start;
                    background: #FFFFFF;
                    color: #1B1B1B;
                    border-bottom-left-radius: 4px;
                    box-shadow: 3px 3px 0 #1B1B1B;
                }

                .ai-chatbot-message.user {
                    align-self: flex-end;
                    background: #7C6AE8;
                    color: #FFFFFF;
                    border-bottom-right-radius: 4px;
                    box-shadow: 3px 3px 0 #1B1B1B;
                }

                .ai-chatbot-quick-replies {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    align-self: flex-start;
                    max-width: 92%;
                    margin-top: -2px;
                }

                .ai-chatbot-quick-reply {
                    border: 2px solid #1B1B1B;
                    background: #FFFFFF;
                    color: #1B1B1B;
                    font-size: 13px;
                    font-weight: 700;
                    font-family: inherit;
                    padding: 6px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    box-shadow: 2px 2px 0 #1B1B1B;
                    transition:
                        transform .15s ease,
                        box-shadow .15s ease;
                }

                .ai-chatbot-quick-reply:hover {
                    transform: translate(-1px,-1px);
                    box-shadow: 3px 3px 0 #1B1B1B;
                }

                .ai-chatbot-typing {
                    align-self: flex-start;
                    display: flex;
                    gap: 4px;
                    padding: 12px 14px;
                    background: #FFFFFF;
                    border: 2px solid #1B1B1B;
                    border-radius: 16px;
                    border-bottom-left-radius: 4px;
                    box-shadow: 3px 3px 0 #1B1B1B;
                }

                .ai-chatbot-typing span {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #1B1B1B;
                    animation: ai-chatbot-bounce 1.2s infinite ease-in-out;
                }

                .ai-chatbot-typing span:nth-child(2) {
                    animation-delay: .15s;
                }

                .ai-chatbot-typing span:nth-child(3) {
                    animation-delay: .3s;
                }

                @keyframes ai-chatbot-bounce {
                    0%,60%,100% {
                        transform: translateY(0);
                        opacity: .5;
                    }

                    30% {
                        transform: translateY(-5px);
                        opacity: 1;
                    }
                }

                .ai-chatbot-input-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    padding: 12px;
                    border-top: 2.5px solid #1B1B1B;
                    background: #F5EAD2;
                    flex-shrink: 0;
                }

                .ai-chatbot-input {
                    flex: 1;
                    resize: none;
                    border: 2px solid #1B1B1B;
                    border-radius: 14px;
                    padding: 9px 12px;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 600;
                    color: #1B1B1B;
                    background: #FFFFFF;
                    max-height: 90px;
                    outline: none;
                }

                .ai-chatbot-input:focus {
                    box-shadow: 2px 2px 0 #1B1B1B;
                }

                .ai-chatbot-send {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: 2px solid #1B1B1B;
                    background: #7C6AE8;
                    color: #FFFFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    box-shadow: 2px 2px 0 #1B1B1B;
                    transition: transform .15s ease;
                }

                .ai-chatbot-send:hover:not(:disabled) {
                    transform: translate(-1px,-1px);
                }

                .ai-chatbot-send:active:not(:disabled) {
                    transform: translate(1px,1px);
                }

                .ai-chatbot-send:disabled {
                    opacity: .4;
                    cursor: not-allowed;
                }

                @media (max-width: 640px) {
                    .ai-chatbot-panel {
                        right: 16px;
                        bottom: 90px;
                        width: calc(100vw - 32px);
                        height: min(600px, calc(100vh - 120px));
                    }

                    .ai-chatbot-launcher {
                        right: 16px;
                        bottom: 16px;
                    }

                    .ai-chatbot-peek {
                        right: 16px;
                        bottom: 98px;
                    }

                    .ai-chatbot-peek-bubble {
                        max-width: min(240px, calc(100vw - 100px));
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ai-chatbot-mascot,
                    .ai-chatbot-message,
                    .ai-chatbot-status-dot,
                    .ai-chatbot-typing span {
                        animation: none;
                    }
                }
            `}</style>

            <div className="ai-chatbot-root">
                {/* Peek message */}
                <div
                    className={`ai-chatbot-peek ${
                        showPeek ? "show" : ""
                    }`}
                >
                    <Mascot className="ai-chatbot-mascot" />

                    <div
                        className="ai-chatbot-peek-bubble"
                        onClick={openChat}
                    >
                        {CONFIG.peekMessage}
                    </div>
                </div>

                {/* Chat panel */}
                <div
                    className={`ai-chatbot-panel ${
                        isOpen ? "open" : ""
                    }`}
                >
                    {/* Header */}
                    <div className="ai-chatbot-header">
                        <Mascot className="ai-chatbot-header-avatar" />

                        <div className="ai-chatbot-header-text">
                            <div className="ai-chatbot-header-name">
                                {CONFIG.storeName}
                            </div>

                            <div className="ai-chatbot-header-status">
                                <span className="ai-chatbot-status-dot" />
                                <span>{CONFIG.statusText}</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="ai-chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`ai-chatbot-message ${
                                    message.role === "user"
                                        ? "user"
                                        : "bot"
                                }`}
                            >
                                {message.content}
                            </div>
                        ))}

                        {/* Quick replies */}
                        {messages.length === 1 &&
                            messages[0]?.role === "assistant" && (
                                <div className="ai-chatbot-quick-replies">
                                    {CONFIG.quickReplies.map(
                                        (reply) => (
                                            <button
                                                key={reply}
                                                type="button"
                                                className="ai-chatbot-quick-reply"
                                                onClick={() =>
                                                    handleQuickReply(
                                                        reply
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {reply}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="ai-chatbot-typing">
                                <span />
                                <span />
                                <span />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="ai-chatbot-input-row">
                        <textarea
                            ref={textareaRef}
                            className="ai-chatbot-input"
                            rows="1"
                            value={input}
                            placeholder="Ask about products, orders, returns…"
                            onChange={(event) => {
                                setInput(event.target.value);
                                autoResize();
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />

                        <button
                            type="button"
                            className="ai-chatbot-send"
                            aria-label="Send message"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>

                {/* Launcher */}
                <button
                    type="button"
                    className={`ai-chatbot-launcher ${
                        isOpen ? "open" : ""
                    }`}
                    aria-label={
                        isOpen
                            ? "Close AI assistant"
                            : "Open AI assistant"
                    }
                    onClick={toggleChat}
                >
                    <span className="ai-chatbot-launcher-icon chat">
                        <ChatIcon />
                    </span>

                    <span className="ai-chatbot-launcher-icon close">
                        <CloseIcon />
                    </span>
                </button>
            </div>
        </>
    );
};

export default AIChatbot;