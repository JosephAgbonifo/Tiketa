"use client";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-tiketa-white border-t-4 border-tiketa-violet hover:border-tiketa-cyan transition-all duration-700 text-tiketa-black font-outfit w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10 md:gap-16">
        {/* Logo & Name */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
          <Image
            src="/images/flogo.png"
            width={80}
            height={40}
            alt="Tiketa logo"
            className="w-[60px] sm:w-[80px] h-auto"
          />
          <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-bl from-tiketa-blue via-tiketa-violet to-tiketa-pink bg-clip-text text-transparent">
            Tiketa
          </h2>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center md:text-left">
          <FooterLink href="/events" title="Events" />
          <FooterLink href="/about" title="About" />
          {/* <FooterLink href="/marketplace" title="Marketplace" /> */}
          <FooterLink href="/privacypolicy" title="Privacy Policy" />
          <FooterLink href="/terms" title="Terms of Service" />
          {/* <FooterLink href="/faq" title="FAQ" /> */}
          {/* <FooterLink href="/support" title="Support" /> */}
          <FooterLink href="/contact" title="Contact" />
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
          <FooterIcon href="https://twitter.com" icon={<Twitter size={20} />} />
          <FooterIcon
            href="https://instagram.com"
            icon={<Instagram size={20} />}
          />
          <FooterIcon
            href="https://facebook.com"
            icon={<Facebook size={20} />}
          />
          <FooterIcon
            href="https://linkedin.com"
            icon={<Linkedin size={20} />}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-300 rounded-full"></div>

        {/* Footer Bottom */}
        <div className="text-center md:text-left text-gray-500 text-sm">
          <p>&copy; {year} Morph — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Small Components ---------- */

function FooterLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="text-primary font-semibold hover:text-primary-hover transition-all hover:scale-105"
    >
      {title}
    </Link>
  );
}

function FooterIcon({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactElement;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary-hover transition-all hover:scale-110"
    >
      {icon}
    </Link>
  );
}
