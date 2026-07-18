// components/ai/LanguageSelector.tsx
"use client";

import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportedLanguageCode } from "@/types/ai";
import { SUPPORTED_LANGUAGES } from "@/lib/ai/mock-data";

export interface LanguageSelectorProps {
  value: SupportedLanguageCode;
  onChange: (lang: SupportedLanguageCode) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SupportedLanguageCode)}>
      <SelectTrigger className="h-9 w-[140px] gap-1.5 text-xs" aria-label="Select assistant language">
        <Languages className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="mr-2">{lang.flag}</span>
            {lang.nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
