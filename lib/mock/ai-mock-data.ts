// lib/mock/ai-mock-data.ts
// Mock data source for the AI module. Swap for real API/service calls later —
// see services/ai-service.ts for the seam where that should happen.

import type {
  AIMessage,
  Conversation,
  PromptTemplate,
  QuickAction,
  SuggestedQuestion,
  SupportedLanguage,
} from "@/types/ai";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Gate 4 crowd surge risk",
    preview: "Predicted congestion in the next 20 minutes near Gate 4...",
    updatedAt: "2026-07-18T14:32:00Z",
    pinned: true,
    category: "crowd-management",
    messageCount: 12,
  },
  {
    id: "conv-2",
    title: "Shuttle bus rerouting",
    preview: "Recommend rerouting Shuttle B due to traffic on 6th Ave...",
    updatedAt: "2026-07-18T13:05:00Z",
    category: "transport",
    messageCount: 6,
  },
  {
    id: "conv-3",
    title: "Volunteer shift gaps",
    preview: "3 volunteer shifts are understaffed for the evening match...",
    updatedAt: "2026-07-18T11:47:00Z",
    category: "volunteer",
    messageCount: 4,
  },
  {
    id: "conv-4",
    title: "Medical tent response time",
    preview: "Average response time trending up in Section C...",
    updatedAt: "2026-07-17T22:10:00Z",
    category: "emergency",
    messageCount: 9,
  },
  {
    id: "conv-5",
    title: "Attendance vs. forecast",
    preview: "Actual attendance is 4% above forecast for Match 12...",
    updatedAt: "2026-07-17T19:20:00Z",
    category: "analytics",
    messageCount: 7,
  },
];

export const MOCK_MESSAGES: Record<string, AIMessage[]> = {
  "conv-1": [
    {
      id: "m1",
      role: "user",
      content: "What's the crowd risk at Gate 4 right now?",
      createdAt: "2026-07-18T14:30:00Z",
      status: "complete",
    },
    {
      id: "m2",
      role: "assistant",
      content:
        "**Gate 4 risk: Moderate → High (next 20 min)**\n\n- Current density: 3.2 people/m²\n- Inflow rate: +18% vs. 15-min average\n- Contributing factor: Section 114 concourse bottleneck\n\n**Recommended actions:**\n1. Open auxiliary lane 4B\n2. Dispatch 2 additional stewards\n3. Trigger digital signage reroute to Gate 5\n\nWould you like me to draft a dispatch message for the operations team?",
      createdAt: "2026-07-18T14:30:40Z",
      status: "complete",
    },
  ],
};

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: "sq-1",
    label: "Current crowd density",
    prompt: "What is the current crowd density across all gates?",
    category: "crowd-management",
    icon: "Users",
  },
  {
    id: "sq-2",
    label: "Emergency response status",
    prompt: "Summarize the status of all active emergency response teams.",
    category: "emergency",
    icon: "Siren",
  },
  {
    id: "sq-3",
    label: "Transport delays",
    prompt: "Are there any transport delays affecting fan arrivals?",
    category: "transport",
    icon: "Bus",
  },
  {
    id: "sq-4",
    label: "Volunteer coverage",
    prompt: "Which zones are understaffed for the next shift?",
    category: "volunteer",
    icon: "HeartHandshake",
  },
  {
    id: "sq-5",
    label: "Match-day analytics",
    prompt: "Give me a quick analytics summary for today's match.",
    category: "analytics",
    icon: "BarChart3",
  },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "pt-1",
    title: "Incident briefing",
    description: "Generate a structured incident summary for stakeholders.",
    template:
      "Create an incident briefing for {{incidentType}} at {{location}}, including severity, affected zones, and recommended response.",
    category: "emergency",
    variables: [
      { key: "incidentType", label: "Incident type", placeholder: "e.g. medical emergency" },
      { key: "location", label: "Location", placeholder: "e.g. Section 114" },
    ],
  },
  {
    id: "pt-2",
    title: "Crowd flow forecast",
    description: "Forecast crowd movement for a specific gate or zone.",
    template: "Forecast crowd flow at {{zone}} for the next {{minutes}} minutes.",
    category: "crowd-management",
    variables: [
      { key: "zone", label: "Zone", placeholder: "e.g. Gate 4" },
      { key: "minutes", label: "Minutes", placeholder: "e.g. 30" },
    ],
  },
  {
    id: "pt-3",
    title: "Shift optimization",
    description: "Suggest an optimized volunteer shift schedule.",
    template: "Optimize volunteer shifts for {{event}} on {{date}} to cover all zones.",
    category: "volunteer",
    variables: [
      { key: "event", label: "Event", placeholder: "e.g. Quarterfinal Match" },
      { key: "date", label: "Date", placeholder: "e.g. July 20" },
    ],
  },
  {
    id: "pt-4",
    title: "Transport delay analysis",
    description: "Analyze the impact of a transport disruption.",
    template: "Analyze the impact of {{disruption}} on fan arrivals and suggest mitigation.",
    category: "transport",
    variables: [
      { key: "disruption", label: "Disruption", placeholder: "e.g. Metro line closure" },
    ],
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-1",
    label: "Summarize today",
    description: "Full-day operations summary",
    icon: "FileText",
    prompt: "Summarize today's stadium operations across all modules.",
  },
  {
    id: "qa-2",
    label: "Flag anomaly",
    description: "Report an unusual pattern",
    icon: "AlertTriangle",
    prompt: "Help me flag and document an operational anomaly.",
  },
  {
    id: "qa-3",
    label: "Draft dispatch",
    description: "Message for ops team",
    icon: "Send",
    prompt: "Draft a dispatch message for the operations team.",
  },
  {
    id: "qa-4",
    label: "Translate alert",
    description: "Multilingual broadcast",
    icon: "Languages",
    prompt: "Translate the latest public safety alert into 5 languages.",
  },
];

const MOCK_RESPONSES = [
  "Based on current sensor data, everything is trending within normal operating range. I'll keep monitoring and flag any deviation above threshold.",
  "**Here's what I found:**\n\n- No critical alerts in the last 15 minutes\n- 2 zones approaching moderate density\n- All emergency teams reporting green status\n\nLet me know if you'd like a deeper breakdown of any zone.",
  "I've drafted a recommendation. Would you like me to route this to the operations channel, or refine it first?",
  "That pattern has occurred twice this week, both times resolving within 10 minutes without escalation. I recommend monitoring rather than immediate action.",
];

export function getMockAssistantReply(userPrompt: string): string {
  const hash = userPrompt.length % MOCK_RESPONSES.length;
  return MOCK_RESPONSES[hash];
}
