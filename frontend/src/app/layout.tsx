import type { Metadata } from "next";
import "./globals.css";
import Wrapper from "./wrapper";

interface AuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  [key: string]: unknown; // optional extra fields if needed
}

interface PaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

interface PaymentCallbacks {
  /** Called when the payment is ready for server approval */
  onReadyForServerApproval: (paymentId: string) => void;

  /** Called when the payment is ready for server completion */
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;

  /** Called if the user cancels the payment */
  onCancel: (paymentId?: string) => void;

  /** Called if an error occurs during the payment process */
  onError: (error: Error) => void;
}

interface PiSDK {
  init: (options: { version: string; sandbox: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: Payment) => void
  ) => Promise<AuthResult>;
  createPayment: (
    paymentData: PaymentData,
    callbacks: PaymentCallbacks
  ) => void;
}

declare global {
  interface Window {
    Pi: PiSDK;
  }
}

export const metadata: Metadata = {
  title: "Tiketa — On-Chain Event Ticketing Platform",
  description:
    "Tiketa is a blockchain-powered event ticketing platform enabling secure on-chain payments with Pi Network, QR verification, and seamless event management.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  applicationName: "Tiketa",
  themeColor: "#790000", // matches your primary brand color
  authors: [{ name: "Tiketa Team" }],
  keywords: [
    "Tiketa",
    "Event Ticketing",
    "Blockchain",
    "Pi Network",
    "On-Chain Payments",
    "Crypto Events",
    "Decentralized Ticketing",
    "Next.js",
  ],
  openGraph: {
    title: "Tiketa — Secure Blockchain Event Ticketing",
    description:
      "Experience a new era of ticketing with on-chain payments powered by Pi Network. Buy, sell, and verify tickets securely with Tiketa.",
    url: "https://your-domain.com",
    siteName: "Tiketa",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Tiketa Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiketa — On-Chain Event Ticketing",
    description:
      "Blockchain-based ticketing powered by Pi Network. Transparent, secure, and easy to use.",
    images: ["/android-chrome-512x512.png"],
    creator: "@tiketa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Wrapper>{children}</Wrapper>;
}
