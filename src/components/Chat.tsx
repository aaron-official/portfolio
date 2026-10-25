"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Chat.module.css";
import ReactMarkdown from "react-markdown";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { ChatRobot } from "./models/ChatRobot";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface ChatProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  /** When given, the toggle stays hidden until the robot has loaded, then it pops in with one of these lines. */
  greetings?: string[];
  /** A one-off line to show (once the twin is ready) when the visitor reaches something specific on the page. */
  nudge?: string | null;
}

export default function Chat({ isOpen, setIsOpen, greetings, nudge }: ChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [robotReady, setRobotReady] = useState(!greetings);
  const [greeting, setGreeting] = useState<string | null>(null);
  // the last line the twin said in a bubble, so it can own its jokes when the visitor asks about them
  const lastBubble = useRef<string | null>(null);
  useEffect(() => {
    if (greeting) lastBubble.current = greeting;
  }, [greeting]);
  useEffect(() => {
    if (isOpen && lastBubble.current) {
      const said = lastBubble.current;
      setMessages((prev) => (prev.length === 0 ? [{ id: 'bubble', role: 'assistant', content: said }] : prev));
    }
  }, [isOpen]);
  const markReady = useCallback(() => setRobotReady(true), []);

  // the hello when the twin first appears, unless a nudge is already waiting
  useEffect(() => {
    if (!greetings || !robotReady || nudge) return;
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    // pick once, when the robot first appears
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robotReady]);

  useEffect(() => {
    if (nudge && robotReady) setGreeting(nudge);
  }, [nudge, robotReady]);

  // every bubble goes away after a while
  useEffect(() => {
    if (!greeting) return;
    const t = setTimeout(() => setGreeting(null), 9000);
    return () => clearTimeout(t);
  }, [greeting]);

  // r3f force-loses a canvas's WebGL context when it unmounts. In dev, StrictMode and Fast Refresh remount while reusing the same <canvas>,
  // which left the robot blank. A new key gives a fresh <canvas> after every effect pass and after any real context loss.
  const [canvasKey, setCanvasKey] = useState(0);
  useEffect(() => setCanvasKey((k) => k + 1), []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user' as const, content: input, id: Date.now().toString() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.filter((m) => m.id !== 'bubble'), said: lastBubble.current })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, { role: 'assistant', content: "", id: assistantId }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        assistantMessage += decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantMessage;
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {greeting && !isOpen && (
        <button type="button" className={styles.bubble} onClick={() => setIsOpen(true)}>
          {greeting}
        </button>
      )}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <span /> Digital Twin
            </div>
            <button 
              className={styles.chatClose} 
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>
          
          <div className={styles.chatMessages}>
            {messages.length === 0 ? (
              <div className={styles.message} style={{ color: "rgba(255, 255, 255, 0.7)", alignSelf: "center", textAlign: "center", marginTop: "auto", marginBottom: "auto" }}>
                Ask me anything about Aaron's experience, skills, or career.
              </div>
            ) : (
              messages.map(m => (
                <div 
                  key={m.id} 
                  className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ))
            )}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <span className="typing-indicator">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <input
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button type="submit" className={styles.chatSubmit} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        className={`${styles.chatToggle} ${isOpen ? styles.hidden : ''} ${!robotReady ? styles.pending : greetings ? styles.pop : ''}`}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open Chat"
      >
        {canvasKey > 0 && (
        <Canvas
          key={canvasKey}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setCanvasKey((k) => k + 1);
            });
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 1, 8]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
          {!isOpen && <ChatRobot hovered={isHovered} onReady={markReady} />}
        </Canvas>
        )}
      </button>
    </div>
  );
}
