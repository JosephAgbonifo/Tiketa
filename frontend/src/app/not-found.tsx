"use client";

import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/10 px-6 py-12 text-center">
      <div className="max-w-md mx-auto bg-white shadow-md border border-border rounded-2xl p-8">
        <SearchX size={80} className="text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-primary mb-4 font-antiqua">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 text-base">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved. Please check the URL or return to the homepage.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary/80 transition"
        >
          <ArrowLeft size={18} />
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
