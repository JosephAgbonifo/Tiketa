"use client";
import React from "react";
import { PixelatedCanvas } from "../ui/pixelated";
import { ArrowBigDown } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] w-full p-10 gap-10 flex-col md:flex-row items-center justify-center overflow-hidden">
      {/* Pixelated Canvas on the left */}
      <p className="absolute text-5xl z-10 opacity-50 inline-flex items-center justify-center top-10 left-10 md:hidden font-antiqua bg-gradient-to-bl from-tiketa-blue via-tiketa-violet to-tiketa-pink bg-clip-text text-transparent">
        Tiketa
      </p>

      <PixelatedCanvas
        src="/images/logo.png"
        width={450}
        height={400}
        cellSize={5}
        dotScale={0.9}
        shape="circle"
        backgroundColor="#ffffff"
        dropoutStrength={0.6}
        interactive
        distortionStrength={0.1}
        distortionRadius={200}
        distortionMode="repel"
        followSpeed={0.2}
        jitterStrength={4}
        jitterSpeed={2}
        sampleAverage
        className="rounded-xl absolute md:relative -z-50 opacity-40 md:opacity-100"
      />

      {/* Right Aligned Text */}
      <div className="flex-1 text-right mr-5 absolute bottom-10 md:relative">
        <h1 className="relative text-4xl font-bold text-primary mb-4 font-antiqua">
          Welcome to{" "}
          <span className="font bg-gradient-to-bl from-primary via-primary-hover to-warning bg-clip-text text-5xl text-transparent">
            Morph
          </span>
        </h1>
        <p className="text-lg text-tiketa-black mb-6">
          A decentralized event ticketing platform powered by Pi blockchain. Get
          your tickets, collect memories!
        </p>
        <Link
          href="/events"
          className="md:block text-xs inline-block w-3/10 float-end my-2 hover:mr-5 md:mr-0 md:clear-both text-center bg-gradient-to-bl  from-primary to-primary-hover  text-background px-6 py-3 rounded-full hover:bg-tiketa-violet transition-all duration-300"
        >
          Browse Events
        </Link>
        <a
          href="/create"
          className="md:block text-xs inline-block w-3/10 float-end my-2 md:mr-0 mr-5 hover:mr-5 md:clear-both text-center  bg-gradient-to-bl  from-primary to-primary-hover text-background px-6 py-3 rounded-full hover:bg-tiketa-violet transition-all duration-300"
        >
          Create Event
        </a>
      </div>
    </div>
  );
}
