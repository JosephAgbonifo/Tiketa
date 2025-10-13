"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CopyEventLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // ✅ Get the current page URL
      const link = window.location.href;
      await navigator.clipboard.writeText(link);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-md p-2 mb-4 bg-primary text-sm text-white flex items-center gap-2"
    >
      {copied ? (
        <>
          <Check className="inline" /> Copied!
        </>
      ) : (
        <>
          <Copy className="inline" /> Click to copy event link
        </>
      )}
    </button>
  );
}
