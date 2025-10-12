"use client";

import { useState } from "react";
import QrScanner from "@/components/QrScanner";
import { CheckCircle2, XCircle, Ticket } from "lucide-react";

type VerifyResponse = {
  success: boolean;
  message?: string;
  ticket?: {
    id: string;
    status: string;
    owner: {
      username: string;
      email: string;
    };
    event: {
      title: string;
      date: string;
      time: string;
      location: string;
    };
  };
};

export default function VerifyTicketPage() {
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerified = (resp: VerifyResponse) => {
    // Set loading to true when verification starts
    setLoading(true);
    setResult(resp);
    // Set loading to false when verification completes
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center font-antiqua">
        Verify Ticket
      </h1>

      <div className="bg-white rounded-2xl shadow-lg border border-border w-full max-w-md p-6 flex flex-col items-center">
        <div className="w-full aspect-square max-w-[320px] mb-6 border-2 border-dashed border-primary/30 rounded-xl flex items-center justify-center overflow-hidden">
          <QrScanner onVerified={handleVerified} />
        </div>

        {loading && (
          <p className="text-gray-500 text-sm animate-pulse">
            Verifying ticket...
          </p>
        )}

        {result && (
          <div
            className={`mt-6 text-center p-4 rounded-xl ${
              result.success
                ? "bg-green-50 border border-green-300"
                : "bg-red-50 border border-red-300"
            }`}
          >
            <div className="flex justify-center mb-2">
              {result.success ? (
                <CheckCircle2 className="text-green-500" size={28} />
              ) : (
                <XCircle className="text-red-500" size={28} />
              )}
            </div>

            <h2
              className={`font-bold text-lg ${
                result.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {result.success ? "Ticket Verified ✅" : "Verification Failed ❌"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {result.message ||
                (result.success ? "Valid ticket" : "Invalid QR")}
            </p>

            {/* Optional: Show details for valid tickets */}
            {result.success && result.ticket && (
              <div className="text-left mt-4 space-y-1 text-sm text-gray-700 border-t border-gray-200 pt-3">
                <p>
                  <span className="font-semibold">Event:</span>{" "}
                  {result.ticket.event.title}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(result.ticket.event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Time:</span>{" "}
                  {result.ticket.event.time}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {result.ticket.event.location}
                </p>
                <p>
                  <span className="font-semibold">Owner:</span>{" "}
                  {result.ticket.owner.username} ({result.ticket.owner.email})
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {result.ticket.status}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        <Ticket size={14} className="inline mr-1" />
        Powered by Tiketa • Secure Ticket Verification System
      </p>
    </div>
  );
}
