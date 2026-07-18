// components/ai/MarkdownRenderer.tsx
"use client";

import React from "react";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight markdown renderer for AI chat content.
 * Supports: headings (## / **), bold, inline code, code blocks, unordered/ordered lists, line breaks.
 * Kept dependency-free by design; swap for `react-markdown` if richer parsing is needed later.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className={cn("space-y-2 text-sm leading-relaxed", className)}>
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; code: string; lang?: string };

function parseMarkdown(input: string): Block[] {
  const lines = input.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || undefined;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", code: codeLines.join("\n"), lang });
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: line.slice(3) });
      i++;
      continue;
    }

    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      blocks.push({ type: "heading", level: 3, text: line.slice(2, -2) });
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (line.trim().length === 0) {
      i++;
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
    i++;
  }

  return blocks;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${idx}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-${idx}`}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${idx}`}>{part}</React.Fragment>;
  });
}

function renderBlock(block: Block, key: number): React.ReactNode {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h3 key={key} className="text-base font-semibold text-foreground">
          {renderInline(block.text, `h-${key}`)}
        </h3>
      ) : (
        <p key={key} className="font-semibold text-foreground">
          {renderInline(block.text, `h3-${key}`)}
        </p>
      );
    case "paragraph":
      return (
        <p key={key} className="text-muted-foreground">
          {renderInline(block.text, `p-${key}`)}
        </p>
      );
    case "ul":
      return (
        <ul key={key} className="list-disc space-y-1 pl-5 text-muted-foreground">
          {block.items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul-${key}-${idx}`)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="list-decimal space-y-1 pl-5 text-muted-foreground">
          {block.items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol-${key}-${idx}`)}</li>
          ))}
        </ol>
      );
    case "code":
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-3 font-mono text-xs text-foreground"
        >
          <code>{block.code}</code>
        </pre>
      );
    default:
      return null;
  }
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}
