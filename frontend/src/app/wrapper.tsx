"use client";
import Script from "next/script";
import { Raleway } from "next/font/google";
import Header from "@/components/general/header";
import Footer from "@/components/general/footer";
import SignIn from "@/components/ui/signin";
import { useState } from "react";
import { postRequest } from "@/utils/api";
import Alert from "@/components/ui/alert";
import { useAuthStore } from "@/store/useAuthStore";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

// Define the payment type
interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  [key: string]: unknown; // optional extra fields if needed
}

type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

export type User = AuthResult["user"];

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [signinState, setSigninState] = useState("");
  const { setAuth } = useAuthStore.getState(); // or useAuthStore() inside a component

  const signInUser = async (authResult: AuthResult) => {
    await postRequest("/user/signin", { authResult });
    return setShowModal(false);
  };

  const signOutUser = async () => {
    return await postRequest("/user/signout", {});
  };

  // Handler for incomplete payments found during authentication
  const onIncompletePaymentFound = async (payment: Payment) => {
    // You can handle incomplete payments here, e.g., notify the user or log
    console.error("Incomplete payment found:", payment);
    const res = await postRequest("/payments/incomplete", { payment });
    console.log("Server approval response:", res);
  };

  const signIn = async () => {
    setSigninState("loading");
    const scopes = ["username", "payments"];
    const authResult: AuthResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );
    signInUser(authResult);
    setUser(authResult.user);
    setAuth(authResult.accessToken, authResult.user);
    setSigninState("done");
  };

  const signOut = () => {
    setUser(null);
    signOutUser();
  };

  const onModalClose = () => {
    setShowModal(false);
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Pi) {
              window.Pi.init({ version: "2.0", sandbox: false });
              console.log("Pi SDK initialized");
            }
          }}
        />
      </head>
      <body className={`${raleway.variable}  font-raleway antialiased`}>
        {signinState == "" ? (
          ""
        ) : signinState == "loading" ? (
          <Alert
            type="warning"
            title="Signing In"
            text="pls wait while we fetch your info"
          />
        ) : (
          <Alert type="success" title="Signed In" text="Welcome " />
        )}
        {/* Background Circles Texture */}
        <div className="inset-0 pointer-events-none z-0 h-screen w-screen fixed">
          <div className="rounded-full absolute top-20 left-20 w-10 h-10 bg-tiketa-blue/20"></div>
          <div className="rounded-full absolute top-60 left-40 w-16 h-16 bg-tiketa-violet/10"></div>
          <div className="rounded-full absolute bottom-20 right-20 w-10 h-10 bg-tiketa-blue/20"></div>
          <div className="rounded-full absolute bottom-60 right-40 w-16 h-16 bg-tiketa-violet/10"></div>
        </div>

        <div className="relative z-10">
          <Header user={user} onSignIn={signIn} onSignOut={signOut} />
          {showModal && (
            <SignIn onSignIn={signIn} onModalClose={onModalClose} />
          )}
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
