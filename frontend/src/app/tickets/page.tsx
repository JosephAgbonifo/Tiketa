"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import Link from "next/link";
import { getRequest } from "@/utils/api";
import { Calendar, MapPin, TicketX } from "lucide-react";

interface TicketData {
  _id: string;
  ticketId: string;
  status: "active" | "used" | "transferred";
  event: {
    _id: string;
    title: string;
    date: string;
    meetingType: string;
    price: string;
    time?: string;
    location: string;
    image?: string | null;
  };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getRequest("event/ticket/mine");
        setTickets(data || []);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load tickets";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // 🟡 Loading & Error States
  if (loading || error || !tickets.length) {
    const msg = error
      ? error
      : loading
      ? "Loading your tickets..."
      : "No tickets found.";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <TicketX className="w-10 h-10 text-primary mb-4" />
        <p className="text-lg font-semibold text-muted-foreground">{msg}</p>
      </div>
    );
  }

  // 🟢 Separate Upcoming & Past Tickets
  const now = new Date();
  const futureTickets = tickets.filter((t) => new Date(t.event.date) >= now);
  const pastTickets = tickets.filter((t) => new Date(t.event.date) < now);

  // 🔹 Ticket Card Component
  const TicketCard = ({ ticket }: { ticket: TicketData }) => (
    <div
      key={ticket._id}
      className="flex flex-col md:flex-row md:p-10 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* Event Image */}
      {ticket.event?.image && (
        <div className="w-full md:w-1/3">
          <Image
            src={`${ticket.event.image}`}
            alt={ticket.event.title}
            width={300}
            height={200}
            unoptimized
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Event Details */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary mb-2 font-antiqua">
            {ticket.event.title}
          </h2>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>
              {new Date(ticket.event.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {ticket.event.time && `• ${ticket.event.time}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin size={16} />
            <span>
              {ticket.event.meetingType === "physical" ? (
                ticket.event.location
              ) : (
                <Link
                  href={ticket.event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {ticket.event.location}
                </Link>
              )}
            </span>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-muted-foreground">
            Ticket ID:{" "}
            <span className="font-mono text-gray-700">{ticket.ticketId}</span>
          </p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              ticket.status === "active"
                ? "bg-green-100 text-green-700"
                : ticket.status === "used"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center items-center bg-gray-50 p-4 md:w-1/4">
        <QRCode
          value={ticket.ticketId}
          size={100}
          bgColor="white"
          fgColor="black"
          className="rounded-md"
        />
      </div>
    </div>
  );

  // 🔹 Page Layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10 px-4 md:px-10">
      <h1 className="text-3xl font-bold text-center mb-10 font-antiqua text-primary">
        Your Tickets
      </h1>

      {/* Future Events */}
      {futureTickets.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5 text-primary/80">
            Upcoming Events
          </h2>
          <div className="grid gap-8">
            {futureTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastTickets.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-5 text-primary/80">
            Past Events
          </h2>
          <div className="grid gap-8">
            {pastTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
