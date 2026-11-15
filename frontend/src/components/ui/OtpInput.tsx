"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into array of characters padded to length
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value;
    const char = rawVal.replace(/\D/g, "").slice(-1); // Only keep the newest numeric character

    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join("");
    onChange(combined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && !newDigits.includes("") && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Current is empty, jump to previous and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);

    const focusIdx = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIdx]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2.5 sm:gap-3.5", className)}>
      {Array.from({ length }, (_, i) => {
        const isFilled = Boolean(digits[i]);
        return (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={digits[i]}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all duration-150 outline-none select-none",
              isFilled ? "text-navy-900 border-navy-900 bg-white" : "text-slate-700 border-slate-300 bg-slate-50/80",
              "focus:border-navy-900 focus:bg-white focus:ring-4 focus:ring-navy-900/10",
              error && "border-red-500 bg-red-50/40 text-red-600 focus:border-red-600 focus:ring-red-500/20",
              disabled && "opacity-50 cursor-not-allowed bg-slate-100"
            )}
            placeholder="•"
            aria-label={`Digit ${i + 1} of ${length}`}
          />
        );
      })}
    </div>
  );
}
