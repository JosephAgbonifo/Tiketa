"use client";

import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import { CheckCircle2, XCircle, Ticket } from "lucide-react";
import { postRequest } from "@/utils/api";

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
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = async (data: string) => {
    setPause(true);
    setLoading(true);
    try {
      // The QR data should contain a ticketId
      const qrData = { ticketId: data };
      const json = await postRequest("event/verify", { qrData });
      setResult(json);
    } catch (error: unknown) {
      console.error("Ticket verification error:", error);
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Network or server error",
      });
    } finally {
      setPause(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center font-antiqua">
        Verify Ticket
      </h1>

      <div className="bg-white rounded-2xl shadow-lg border border-border w-full max-w-md p-6 flex flex-col items-center">
        <div className="w-full aspect-square max-w-[320px] mb-4 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full mb-2 flex justify-between">
            <select
              className="border rounded px-2 py-1 text-sm hidden"
              onChange={(e) => setDeviceId(e.target.value)}
            >
              <option value={undefined}>Select device</option>
              {devices.map((device, index) => (
                <option key={index} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>

            <select
              className="border rounded px-2 py-1 text-sm ml-2 hidden"
              onChange={(e) => setTracker(e.target.value)}
            >
              <option value="centerText">Center Text</option>
              <option value="outline">Outline</option>
              <option value="boundingBox">Bounding Box</option>
              <option value={undefined}>No Tracker</option>
            </select>
          </div>

          <Scanner
            formats={[
              "qr_code",
              "micro_qr_code",
              "rm_qr_code",
              "maxi_code",
              "pdf417",
              "aztec",
              "data_matrix",
              "matrix_codes",
              "dx_film_edge",
              "databar",
              "databar_expanded",
              "codabar",
              "code_39",
              "code_93",
              "code_128",
              "ean_8",
              "ean_13",
              "itf",
              "linear_codes",
              "upc_a",
              "upc_e",
            ]}
            constraints={{
              deviceId: deviceId,
            }}
            onScan={(detectedCodes) => {
              handleScan(detectedCodes[0].rawValue);
            }}
            onError={(error) => console.log(error)}
            styles={{ container: { height: "250px", width: "250px" } }}
            components={{
              onOff: true,
              torch: true,
              zoom: true,
              finder: true,
              tracker: getTracker(),
            }}
            allowMultiple={true}
            scanDelay={2000}
            paused={pause}
          />
        </div>

        {loading && (
          <p className="text-gray-500 text-sm animate-pulse">
            Verifying ticket...
          </p>
        )}

        {result && (
          <div
            className={`mt-4 text-center p-4 rounded-xl w-full ${
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

            {result.success && result.ticket && (
              <div className="text-left mt-4 space-y-1 text-sm text-gray-700 border-t border-gray-200 pt-3">
                <p>
                  <span className="font-semibold">Event:</span>{" "}
                  {result.ticket.event.title}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {result.ticket.event.date
                    ? new Date(result.ticket.event.date).toLocaleDateString()
                    : "Date not available"}
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
