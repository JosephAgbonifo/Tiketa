"use client";

import React from "react";
import { Heart, Tag, DollarSign, ShoppingCart } from "lucide-react";
import Image from "next/image";

export function FeatureSection() {
  const features = [
    {
      icon: <Heart className="w-5 h-5 text-primary inline" />,
      title: "Event Discovery",
      description:
        "Explore a wide range of curated events that match your interests. With a few clicks, you can find, book, and attend experiences that truly inspire you.",
    },
    {
      icon: <Tag className="w-5 h-5 text-primary inline" />,
      title: "NFT Tickets",
      description:
        "Every ticket is a unique NFT on the Pi blockchain — secure, verifiable, and collectible. Say goodbye to counterfeit tickets and hello to digital ownership.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-primary inline" />,
      title: "Buy with Pi",
      description:
        "Purchase tickets seamlessly using Pi cryptocurrency for a faster, more secure, and borderless payment experience.",
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-primary inline" />,
      title: "Integrated Marketplace",
      description:
        "Resell or trade your NFT tickets effortlessly on our built-in marketplace — giving users full control and flexibility over their digital assets.",
    },
  ];

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] w-full flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 gap-12">
      {/* Left Section: Features */}
      <div className="flex-1 max-w-xl">
        <h2 className="text-4xl font-bold text-primary mb-6 font-antiqua leading-tight">
          Why Choose{" "}
          <span className="bg-gradient-to-bl from-primary via-primary-hover to-warning bg-clip-text text-transparent">
            Morph
          </span>
        </h2>

        <p className="text-lg text-text-medium mb-10 text-justify leading-relaxed">
          Experience the next generation of event ticketing with{" "}
          <strong>Tiketa</strong> — a blockchain-powered platform that merges{" "}
          <strong>digital collectibles</strong>,{" "}
          <strong>seamless transactions</strong>, and{" "}
          <strong>event accessibility</strong> for a smarter and more secure
          ecosystem.
        </p>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-bl from-primary via-primary-hover to-warning bg-clip-text text-transparent mb-1">
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-tiketa-black text-justify leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section: Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-3/4 md:w-2/3 max-w-md">
          <Image
            width={600}
            height={600}
            src="/images/logo.png"
            alt="Tiketa Feature Illustration"
            className="rounded-2xl object-contain select-none"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
