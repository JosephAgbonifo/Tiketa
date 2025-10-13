"use client";

import { Search, Ticket, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-10 h-10 text-primary" />,
      title: "Discover Events",
      description:
        "Browse a variety of exciting events and find experiences that match your interests.",
    },
    {
      icon: <Ticket className="w-10 h-10 text-primary" />,
      title: "Buy Ticket",
      description:
        "Purchase a secure, verifiable ticket using Pi cryptocurrency, no middlemen, no hassle.",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-primary" />,
      title: "Attend & Verify",
      description:
        "Show your digital ticket at the venue or online for instant blockchain-based verification.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">How It Works</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white shadow-sm hover:shadow-md rounded-2xl p-6 transition-all border border-gray-100"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
              <span className="mt-4 text-primary font-semibold text-sm">
                Step {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
