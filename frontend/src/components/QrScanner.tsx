"use client";

import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { postRequest } from "@/utils/api";

type QRCodeLocation = {
  topLeftCorner: { x: number; y: number };
  topRightCorner: { x: number; y: number };
  bottomRightCorner: { x: number; y: number };
  bottomLeftCorner: { x: number; y: number };
};

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

export default function QrScanner({
  onVerified,
}: {
  onVerified?: (resp: VerifyResponse) => void;
  verifyUrl?: string; // backend endpoint to POST { qrData }
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      tick(); // start scanning loop
    } catch (err) {
      console.error("Camera error", err);
      setError("Unable to access camera. Make sure permissions are allowed.");
    }
  };

  const stopCamera = () => {
    setScanning(false);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }

    console.log("Camera stopped and scanning halted");
  };

  const tick = () => {
    // Don't continue if scanning is false or animation was canceled
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (code) {
      drawBoundingBox(ctx, code.location);
      setScanning(false);
      cancelAnimationFrame(animationRef.current!); // ✅ stop loop right away

      verifyQr(code.data).finally(() => {
        timeoutRef.current = setTimeout(() => {
          setScanning(true);
          tick(); // restart after short delay
        }, 1500);
      });
    } else {
      // only schedule next frame if scanning is still true
      animationRef.current = requestAnimationFrame(tick);
    }
  };

  const drawBoundingBox = (
    ctx: CanvasRenderingContext2D,
    loc: QRCodeLocation
  ) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(loc.topLeftCorner.x, loc.topLeftCorner.y);
    ctx.lineTo(loc.topRightCorner.x, loc.topRightCorner.y);
    ctx.lineTo(loc.bottomRightCorner.x, loc.bottomRightCorner.y);
    ctx.lineTo(loc.bottomLeftCorner.x, loc.bottomLeftCorner.y);
    ctx.closePath();
    ctx.stroke();
  };

  const verifyQr = async (qrData: string) => {
    try {
      const data = await postRequest("event/verify", { qrData });
      if (data.success) {
        console.log("Ticket verified:", data.ticket);
        if (onVerified) onVerified(data);
      } else {
        console.error("Verification failed:", data.message);
        if (onVerified) onVerified(data);
      }
    } catch (err) {
      console.error("Failed to verify QR:", err);
      setError("Verification request failed");
      const errorResponse: VerifyResponse = {
        success: false,
        message: "Network error",
      };
      return errorResponse;
    }
  };

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative bg-black rounded-md overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {/* overlay controls */}
        <div className="absolute inset-0 pointer-events-none flex items-start justify-center p-3">
          <div className="bg-black/40 text-white rounded px-3 py-1 text-sm">
            {scanning ? "Scanning for QR..." : ""}
          </div>
        </div>
      </div>

      <div className="flex gap-3 my-5 justify-center">
        {!scanning ? (
          <button
            onClick={() => {
              if (!scanning) startCamera();
            }}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={() => {
              if (scanning) stopCamera();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}
