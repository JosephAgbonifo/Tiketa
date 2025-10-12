"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

const EFFECTIVE_DATE = "October 12, 2025"; // update as needed
const CONTACT_EMAIL = "privacy@tiketa.example"; // replace with your real contact

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white border border-border rounded-2xl shadow-md p-8 md:p-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-antiqua">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Effective date: <strong>{EFFECTIVE_DATE}</strong>
          </p>
        </header>

        <section className="prose prose-lg max-w-none text-gray-700">
          <p>
            Tiketa (“we”, “us”, or “our”) is committed to protecting and
            respecting your privacy. This Privacy Policy explains what personal
            information we collect, why we collect it, how we use and share it,
            and the choices available to you regarding our use of your
            information. By using our services or accessing the tiketa platform
            (the “Service”), you agree to the collection and use of information
            in accordance with this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <h3>1.1 Information you provide</h3>
          <ul>
            <li>
              <strong>Account information:</strong>
              username when you register.
            </li>
            <li>
              <strong>Payment & transaction data:</strong> when you purchase
              tickets we collect payment metadata required to process payments
              (we do not store raw payment credentials).
            </li>
            <li>
              <strong>Event details:</strong> organizer information, event
              title, description, date/time, venue, images, and other fields
              required to create or manage events on the platform.
            </li>
            <li>
              <strong>Support communications:</strong> emails, messages, and
              support requests you send to us.
            </li>
          </ul>

          <h3>1.2 Information collected automatically</h3>
          <ul>
            <li>
              <strong>Device & usage data:</strong> IP address, browser type,
              operating system, pages visited, referral/exit pages, and
              timestamps.
            </li>
            <li>
              <strong>Log data:</strong> server logs and diagnostics collected
              when you interact with the Service.
            </li>
            <li>
              <strong>Cookies & similar technologies:</strong> see the Cookies
              section below for details.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for purposes including:</p>
          <ul>
            <li>To provide, maintain and improve the Service.</li>
            <li>To process purchases and manage ticketing workflows.</li>
            <li>
              To communicate with you regarding purchases, events, and support.
            </li>
            <li>
              To analyze usage and trends for product improvements and
              analytics.
            </li>
            <li>
              To detect, prevent, and respond to fraud, abuse, or security
              issues.
            </li>
            <li>
              To comply with legal obligations and enforce our terms and
              policies.
            </li>
          </ul>

          <h2>3. Sharing & Disclosure</h2>
          <p>
            We will not sell your personal information. We may share information
            as follows:
          </p>
          <ul>
            <li>
              <strong>With service providers:</strong> payment processors, email
              providers, cloud/storage providers, analytics vendors, and other
              third parties who perform services on our behalf.
            </li>
            <li>
              <strong>Event organizers:</strong> organizer accounts will receive
              registrant information for events they create (e.g., attendee
              names, contact details) as necessary to run the event.
            </li>
            <li>
              <strong>Legal reasons:</strong> when required by law, to respond
              to legal process, or to protect rights, property or safety of
              Tiketa, our users, or the public.
            </li>
            <li>
              <strong>Business transfers:</strong> in connection with a merger,
              acquisition, asset sale, or bankruptcy, user data may be
              transferred as part of the transaction subject to appropriate
              confidentiality protections.
            </li>
          </ul>

          <h2>4. Cookies & Tracking</h2>
          <p>
            We and our partners use cookies, web beacons, local storage, and
            similar technologies to recognize you and your device, remember
            preferences, and measure and improve our services. You can control
            cookie preferences via your browser settings. Note that blocking
            certain cookies may impact functionality.
          </p>

          <h2>5. Security</h2>
          <p>
            We implement reasonable technical, administrative, and physical
            safeguards designed to protect personal data. However, no system is
            completely secure — we cannot guarantee the absolute security of
            your information. Promptly notify us if you suspect unauthorized
            access to your account.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights regarding your
            personal data, including access, correction, deletion, restriction
            of processing, data portability, and the right to object. To
            exercise any of these rights, contact us at{" "}
            <strong>{CONTACT_EMAIL}</strong>. We may request verification of
            identity before processing requests.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain personal information for as long as necessary to provide
            the Service, comply with legal obligations, resolve disputes, and
            enforce agreements. Retention periods vary based on data type and
            legal requirements.
          </p>

          <h2>8. Children</h2>
          <p>
            Our Service is not intended for children under 13 (or any higher age
            threshold required by local law). We do not knowingly collect
            personal information from children. If we become aware that we
            collected data from a child without parental consent, we will take
            steps to remove it.
          </p>

          <h2>9. International Transfers</h2>
          <p>
            Tiketa operates globally. Personal information may be transferred
            to, and processed in, countries other than your country of
            residence. We take steps to ensure appropriate safeguards are in
            place where required by law (e.g., contractual protections).
          </p>

          <h2>10. Third-Party Links</h2>
          <p>
            The Service may contain links to third-party websites and services.
            This Privacy Policy applies only to data collected by Tiketa. We
            encourage you to review the privacy policies of any third-party
            sites you visit.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            material changes, we will notify you via the Service or by other
            means, and we will update the effective date shown above.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions or requests about this Privacy Policy, please
            contact:
          </p>
          <div className="bg-muted/20 p-4 rounded-md border border-border mt-3">
            <p className="text-sm">
              Email:{" "}
              <Link
                href="mailto:joesefair@gmail.com"
                className="text-primary hover:underline"
              >
                Joesefair@gmail.com
              </Link>
            </p>
            <p className="text-sm mt-1">Address: Tiketa</p>
          </div>

          <hr className="my-6" />

          <p className="text-sm text-muted-foreground">
            For convenience, you can{" "}
            <Link
              href="/privacypolicy.pdf"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <FileText size={16} /> download a printable copy
            </Link>
          </p>

          <p className="mt-6 text-xs text-gray-500">
            By using Tiketa you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
        </section>
      </div>
    </main>
  );
}
