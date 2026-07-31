"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

// Splits message text on URLs and wraps each one in a real <a> tag.
// Only matches http(s) links (never javascript:/data: etc.), and strips
// trailing punctuation like a period or closing paren that isn't part of the URL.
function linkify(text) {
  return text.split(URL_PATTERN).map((part, i) => {
    if (!/^https?:\/\//.test(part)) {
      return <span key={i}>{part}</span>;
    }
    const trailingMatch = part.match(/[).,!?;:\]]+$/);
    const trailing = trailingMatch ? trailingMatch[0] : "";
    const url = trailing ? part.slice(0, -trailing.length) : part;
    return (
      <span key={i}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline underline-offset-2 hover:opacity-80"
        >
          {url}
        </a>
        {trailing}
      </span>
    );
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // drives the open/close transition
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isVisible) inputRef.current?.focus();
  }, [isVisible]);

  function openChat() {
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  }

  function closeChat() {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 150); // matches duration-150 below
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Only role/content go to the API — matches ChatRequest.history on the backend.
    const history = messages.map(({ role, content }) => ({ role, content }));
    const userMessage = { role: "user", content: trimmed };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      setError("Sorry, something went wrong. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={openChat}
          size="icon"
          aria-label="Open chat"
          className={cn(
            "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full",
            "bg-[#E8321A] shadow-lg shadow-[#E8321A]/35 hover:bg-[#c92913]",
            "transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
          )}
        >
          <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
        </Button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Crelands assistant chat"
          className={cn(
            "fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl",
            "bg-gradient-to-br from-[#fff6ec] to-[#ffe9d6] shadow-2xl",
            "origin-bottom-right transition-all duration-150 motion-reduce:transition-none",
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <div className="flex items-center justify-between border-b border-black/[0.06] px-[18px] py-4">
            <div>
              <div className="text-base font-extrabold text-neutral-900">
                Crelands Assistant
              </div>
              {/* <div className="mt-0.5 text-xs text-[#6b5d54]">
                Ask about buying or selling digital products on Crelands.
              </div> */}
            </div>
            <Button
              onClick={closeChat}
              size="icon"
              variant="ghost"
              aria-label="Close chat"
              className="h-8 w-8 rounded-full hover:bg-black/5"
            >
              <X className="h-[18px] w-[18px] text-neutral-900" strokeWidth={2.5} />
            </Button>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="mt-6 text-center text-[13px] text-[#8a7a6d]">
                Hi! Ask me anything about Crelands.
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "self-end rounded-br-md bg-[#E8321A] text-white"
                    : "self-start rounded-bl-md bg-white text-neutral-900"
                )}
              >
                {linkify(m.content)}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-white px-3.5 py-3.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b5a89c] motion-reduce:animate-none [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b5a89c] motion-reduce:animate-none [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b5a89c] motion-reduce:animate-none [animation-delay:300ms]" />
              </div>
            )}

            {error && (
              <div className="self-center text-center text-xs text-[#E8321A]">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-black/[0.06] bg-white/50 p-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="min-h-0 flex-1 resize-none rounded-full border-none bg-white px-4 py-2.5 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-[#E8321A] focus-visible:ring-offset-0"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              aria-label="Send message"
              className="h-10 w-10 shrink-0 rounded-full bg-[#E8321A] hover:bg-[#c92913] disabled:opacity-40"
            >
              <Send className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}