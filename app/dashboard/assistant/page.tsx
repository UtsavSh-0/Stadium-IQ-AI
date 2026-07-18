// app/dashboard/assistant/page.tsx
import type { Metadata } from "next";
import { AIChatInterface } from "@/components/ai/AIChatInterface";

export const metadata: Metadata = {
  title: "AI Assistant — StadiumIQ",
  description: "Ask StadiumIQ AI about live crowd, emergency, transport, and volunteer operations.",
};

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Natural-language operations intelligence for match-day decision making.
        </p>
      </div>
      <AIChatInterface />
    </div>
  );
}
