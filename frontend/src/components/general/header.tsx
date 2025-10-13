"use client";
import { useState } from "react";
import {
  Menu,
  Home,
  Calendar,
  Info,
  X,
  Verified,
  Ticket,
  Pen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

type User = AuthResult["user"];

interface Props {
  onSignIn: () => void;
  onSignOut: () => void;
  user: User | null;
}

export default function Header(props: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="h-20 relative w-full pt-5 bg-tiketa-white z-50">
      <div className="text-tiketa-black gap-10 h-2 font-antiqua flex items-center p-10">
        <div className="flex items-center">
          <Image
            src="/images/flogo.png"
            width={150}
            height={50}
            className="inline"
            alt="tiketa"
          />
        </div>

        <div className="flex-1 flex justify-end">
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 font-bold text-md">
            <Link href="/" className="text-primary hover:text-primary-hover">
              Home
            </Link>
            <Link
              href="/events"
              className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
            >
              Events
            </Link>
            <Link
              href="/create"
              className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
            >
              Create
            </Link>
            <Link
              href="/tickets"
              className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
            >
              Tickets
            </Link>
            <Link
              href="/tickets/verify"
              className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
            >
              Verify
            </Link>
            <Link
              href="/about"
              className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
            >
              About
            </Link>

            <div>
              {props.user === null ? (
                <button
                  onClick={props.onSignIn}
                  className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
                >
                  Sign in
                </button>
              ) : (
                <div>
                  <button
                    type="button"
                    className="text-primary hover:text-primary-hover relative after:h-1 after:w-0 after:absolute after:bg-primary-hover after:-bottom-1 after:left-0 hover:after:w-[100%] after:transition-all transition-all duration-700 after:duration-700"
                    onClick={props.onSignOut}
                  >
                    Sign out
                  </button>
                  <div className="inline p-2 rounded-md cursor-default bg-primary text-white mx-5">
                    @{props.user.username}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Hamburger Icon */}
          <div className="md:hidden px-5 h-full flex items-center justify-center">
            {props.user === null ? (
              <button
                onClick={() => {
                  props.onSignIn();
                  closeMobileMenu();
                }}
                className="flex items-center bg-primary text-white rounded-md p-1 space-x-4 text-tiketa-black hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                Sign in
              </button>
            ) : (
              <div>
                <div className="text-tiketa-black text-xs font-semibold py-2 inline">
                  @{props.user.username}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    props.onSignOut();
                    closeMobileMenu();
                  }}
                  className="inline-flex bg-primary h-8 text-white rounded-md p-1 ml-2 items-center space-x-4 py-3 text-tiketa-black hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-tiketa-black">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden z-[99] h-screen bg-tiketa-white fixed top-0 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "w-1/2" : "w-0"
        }`}
      >
        <button
          onClick={toggleMobileMenu}
          className="text-tiketa-black m-5 float-right"
        >
          <X size={24} />
        </button>

        <div className="px-6 py-8 bg-background h-screen">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-4 py-3 text-tiketa-black hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/events"
            onClick={closeMobileMenu}
            className="flex items-center space-x-4 py-3 text-tiketa-black hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Calendar size={20} />
            <span>Events</span>
          </Link>
          <Link
            href="/create"
            onClick={closeMobileMenu}
            className="flex items-center space-x-4 py-3 text-tiketa-black hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Pen size={20} />
            <span>Create</span>
          </Link>
          <Link
            href="/tickets"
            onClick={closeMobileMenu}
            className="flex items-center space-x-4 py-3 text-tiketa-black hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Ticket size={20} />
            <span>Tickets</span>
          </Link>
          <Link
            href="/tickets/verify"
            onClick={closeMobileMenu}
            className="flex items-center space-x-4 py-3 text-tiketa-black hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Verified size={20} />
            <span>Verify</span>
          </Link>
          <Link
            href="/about"
            onClick={closeMobileMenu}
            className="flex items-center space-x-4 py-3 text-tiketa-black hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
