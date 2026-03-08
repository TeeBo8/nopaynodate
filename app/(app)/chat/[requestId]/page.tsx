"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/trpc-react";
import { pusherClient } from "@/lib/pusher-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface PusherMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: msgs, refetch } = api.messages.list.useQuery({ requestId });

  const sendMessage = api.messages.send.useMutation({
    onSuccess: () => {
      setContent("");
      refetch();
    },
  });

  // Pusher : écouter les nouveaux messages en temps réel
  useEffect(() => {
    const channel = pusherClient.subscribe(`private-chat-${requestId}`);
    channel.bind("new-message", (_data: PusherMessage) => {
      refetch();
    });
    return () => {
      pusherClient.unsubscribe(`private-chat-${requestId}`);
    };
  }, [requestId, refetch]);

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSend = () => {
    if (!content.trim()) return;
    sendMessage.mutate({ requestId, content: content.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b p-4">
        <h1 className="font-semibold">Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs?.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-8">
            No messages yet. Start the conversation!
          </p>
        )}
        {msgs?.map((msg) => {
          const isMe = msg.senderId === session?.user.id;
          return (
            <div
              key={msg.id}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your message..."
          className="flex-1"
          disabled={sendMessage.isPending}
        />
        <Button
          onClick={handleSend}
          disabled={sendMessage.isPending || !content.trim()}
          size="icon"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
