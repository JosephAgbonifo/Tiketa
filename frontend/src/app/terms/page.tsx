"use client";

import React from "react";
import Link from "next/link";

const EFFECTIVE_DATE = "October 12, 2025";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white border border-border rounded-2xl shadow-md p-8 md:p-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-antiqua">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Effective Date: <strong>{EFFECTIVE_DATE}</strong>
          </p>
        </header>

        <section className="prose prose-lg max-w-none text-gray-700">
          <p>
            Welcome to Tiketa (“we”, “us”, or “our”), an event ticketing
            platform powered by the <strong>Pi Network</strong>. These Terms of
            Service (“Terms”) govern your access to and use of Tiketa’s website,
            dApp, and related services (collectively, the “Service”). By using
            Tiketa, you agree to these Terms and our{" "}
            <Link
              href="/privacypolicy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            . If you do not agree, please discontinue use of the Service.
          </p>

          <h2>1. Overview</h2>
          <p>
            Tiketa enables event organizers to create and manage events, and
            allows users to purchase tickets using{" "}
            <strong>Pi cryptocurrency</strong>
            through on-chain transactions within the Pi Network ecosystem.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old or of legal age in your
            jurisdiction to use Tiketa. By using the Service, you confirm that
            you meet these requirements and agree to be legally bound by these
            Terms.
          </p>

          <h2>3. Accounts</h2>
          <ul>
            <li>
              You may need a Pi Network account (via the Pi Browser or Pi
              Wallet) to access certain Tiketa features.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              wallet keys and login information.
            </li>
            <li>
              Tiketa does not have access to or store your private keys. Lost
              keys cannot be recovered.
            </li>
          </ul>

          <h2>4. On-Chain Payments</h2>
          <p>
            Tiketa supports only <strong>on-chain Pi payments</strong> for all
            ticket transactions. All payments occur via the official Pi Network
            blockchain using smart contracts.
          </p>
          <ul>
            <li>
              Once a Pi transaction is confirmed on-chain, it is immutable and
              cannot be reversed.
            </li>
            <li>
              Refunds are at the sole discretion of the event organizer and must
              be initiated by them, not Tiketa.
            </li>
            <li>
              Tiketa is not responsible for delayed or failed transactions
              resulting from blockchain congestion, wallet errors, or node
              downtime.
            </li>
            <li>
              You acknowledge that on-chain payments are subject to the Pi
              Network’s operational status and blockchain confirmations.
            </li>
          </ul>

          <h2>5. Smart Contracts & Fees</h2>
          <p>
            By using Tiketa, you agree to interact with smart contracts deployed
            on the Pi blockchain. These contracts facilitate secure ticket
            minting, ownership verification, and transfers.
          </p>
          <ul>
            <li>Network (gas) fees in Pi may apply for each transaction.</li>
            <li>
              Tiketa may charge a small service fee for each event or ticket
              sold, disclosed before payment.
            </li>
            <li>
              You are responsible for all Pi network fees incurred during
              payment or ticket transfers.
            </li>
          </ul>

          <h2>6. Event Organizers</h2>
          <p>Organizers using Tiketa agree to:</p>
          <ul>
            <li>Provide accurate, lawful, and non-fraudulent event details.</li>
            <li>
              Manage their own event refunds and cancellations in compliance
              with Pi blockchain finality.
            </li>
            <li>
              Ensure that smart contracts used for event tickets comply with
              Tiketa’s safety and quality requirements.
            </li>
          </ul>

          <h2>7. Ticket Buyers</h2>
          <ul>
            <li>
              Each ticket is uniquely linked to the buyer’s Pi wallet address
              and verifiable on-chain.
            </li>
            <li>
              Tickets cannot be modified, duplicated, or sold outside approved
              transfer channels.
            </li>
            <li>
              Tiketa is not responsible for losses arising from incorrect wallet
              addresses or unauthorized transfers.
            </li>
          </ul>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Tiketa and its affiliates
            are not liable for any indirect, incidental, or consequential
            damages arising from blockchain transactions, including but not
            limited to:
          </p>
          <ul>
            <li>Failed Pi payments or smart contract errors.</li>
            <li>Wallet mismanagement or private key loss.</li>
            <li>Organizer or attendee disputes.</li>
          </ul>
          <p>
            Tiketa operates as a decentralized service interface and does not
            take custody of user funds at any time.
          </p>

          <h2>9. Security & Wallet Responsibility</h2>
          <p>
            You are solely responsible for maintaining the security of your Pi
            wallet and private keys. Tiketa will never request your private key
            or seed phrase.
          </p>
          <p>
            Any on-chain transaction you initiate is final once broadcasted to
            the network. Please double-check all wallet addresses and event
            details before confirming payments.
          </p>

          <h2>10. Modifications to Service</h2>
          <p>
            We may update, suspend, or discontinue any aspect of Tiketa or its
            smart contract functionality at any time without prior notice.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed under the laws of
            Nigeria (or your applicable jurisdiction). Any disputes shall be
            resolved in the courts located within Nigeria.
          </p>

          <h2>12. Contact</h2>
          <p>For support, feedback, or dispute resolution, contact us at:</p>
          <div className="bg-muted/20 p-4 rounded-md border border-border mt-3">
            <p className="text-sm">
              Email:{" "}
              <a
                href="joesefair@gmail.com"
                className="text-primary hover:underline"
              >
                joesefair@gmail.com
              </a>
            </p>
            <p className="text-sm mt-1">Address: Tiketa</p>
          </div>

          <hr className="my-6" />

          <p className="text-xs text-gray-500">
            By using Tiketa, you acknowledge that you understand and agree to
            the risks of blockchain-based transactions and have read these Terms
            of Service in full.
          </p>
        </section>
      </div>
    </main>
  );
}
