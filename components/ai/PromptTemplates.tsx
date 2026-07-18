// components/ai/PromptTemplates.tsx
"use client";

import { useState } from "react";
import { LayoutTemplate } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PromptTemplate } from "@/types/ai";
import { PROMPT_TEMPLATES } from "@/lib/ai/mock-data";

export interface PromptTemplatesProps {
  templates?: PromptTemplate[];
  onUse: (prompt: string) => void;
}

export function PromptTemplates({ templates = PROMPT_TEMPLATES, onUse }: PromptTemplatesProps) {
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  function openTemplate(template: PromptTemplate) {
    setActiveTemplate(template);
    setValues({});
  }

  function handleUse() {
    if (!activeTemplate) return;
    let filled = activeTemplate.template;
    for (const v of activeTemplate.variables ?? []) {
      filled = filled.replaceAll(`{{${v.key}}}`, values[v.key]?.trim() || `[${v.label}]`);
    }
    onUse(filled);
    setActiveTemplate(null);
  }

  return (
    <Dialog open={!!activeTemplate} onOpenChange={(open) => !open && setActiveTemplate(null)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {templates.map((template) => (
          <DialogTrigger asChild key={template.id}>
            <Card
              role="button"
              tabIndex={0}
              onClick={() => openTemplate(template)}
              className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <CardHeader className="flex flex-row items-start gap-2 space-y-0 pb-2">
                <LayoutTemplate className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <CardTitle className="text-sm">{template.title}</CardTitle>
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </DialogTrigger>
        ))}
      </div>

      <DialogContent className="sm:max-w-md">
        {activeTemplate && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-2">
                {activeTemplate.title}
              </DialogTitle>
            </DialogHeader>
            <CardContent className="space-y-3 p-0">
              {(activeTemplate.variables ?? []).map((v) => (
                <div key={v.key} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{v.label}</label>
                  <Input
                    placeholder={v.placeholder}
                    value={values[v.key] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button onClick={handleUse} className="w-full">
                Use template
              </Button>
            </CardContent>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
