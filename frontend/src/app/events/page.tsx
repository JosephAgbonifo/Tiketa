"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Pi } from "lucide-react";
import Image from "next/image";
import { getRequest } from "@/utils/api";
import Alert from "@/components/ui/alert";

interface EventData {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  meetingType: string;
  location: string;
  capacity: number;
  ticketType: "free" | "paid";
  price: number;
  image?: string | null;
  organizer?: {
    username?: string;
    email?: string;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const fetchEvents = async (selectedFilter: "all" | "mine") => {
    setLoading(true);
    try {
      const endpoint =
        selectedFilter === "mine" ? "/event/get?mine=true" : "/event/get";
      const data = await getRequest(endpoint);
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-10">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 font-antiqua text-primary">
        Recent Events
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        {["all", "mine"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "all" | "mine")}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 ${
              filter === type
                ? "bg-primary text-white border-primary shadow-md"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {type === "all" ? "All Events" : "My Events"}
          </button>
        ))}
      </div>

      {/* Data States */}
      {loading ? (
        <p className="text-center text-muted-foreground mt-20">
          Loading events...
        </p>
      ) : error === "Request failed with status code 401" ? (
        <>
          <Alert type="primary" title="Auth Error" text="Pls sign in first" />
          <p className="text-center text-destructive mt-20">Not logged in</p>
        </>
      ) : error ? (
        <>
          <Alert type="primary" title="Auth Error" text="Pls sign in first" />
          <p className="text-center text-destructive mt-20">Error: {error}</p>
        </>
      ) : events.length === 0 ? (
        <p className="text-center text-muted-foreground mt-20">
          No events found.
        </p>
      ) : (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-11/12 max-w-7xl mx-auto">
          {events.map((event) => (
            <Link
              href={`/events/${event.eventId}`}
              key={event._id}
              className="group bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative w-full h-52 bg-gray-100">
                {event.image ? (
                  <Image
                    src={`http://localhost:8765/uploads/${event.image}`}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg md:text-xl font-semibold text-primary line-clamp-1">
                  {event.title}
                </h3>

                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                  {event.description}
                </p>

                <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {event.time}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {event.meetingType}
                  </span>
                </div>

                <div className="mt-4">
                  {event.ticketType === "paid" ? (
                    <p className="text-primary font-semibold">
                      <Pi className="inline w-4 mr-1" />
                      {event.price.toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-green-600 font-semibold">Free</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
