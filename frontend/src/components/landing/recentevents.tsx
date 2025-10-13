"use client";
import { useEffect, useState } from "react";
import { TicketX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getRequest } from "@/utils/api";

interface Event {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  organizer?: {
    username: string;
    email: string;
  };
}

export default function RecentEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getRequest("/event/getall");
        if (!Array.isArray(data)) throw new Error("Unexpected response format");

        const latest = data
          .sort(
            (a: Event, b: Event) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 10);

        setEvents(latest);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg animate-pulse">
        Loading events...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-600 text-lg">
        {error}
      </div>
    );

  if (events.length === 0)
    return (
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold text-primary mb-6 font-antiqua">
          Recent Open Events
        </h2>
        <p className="text-gray-600 text-xl flex items-center justify-center gap-2 font-medium">
          <TicketX className="text-primary" size={28} /> No Events Available
        </p>
      </section>
    );

  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-primary mb-10 text-center font-antiqua">
        Recent Open Events
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => (
          <Link
            href={`/events/${event.eventId}`}
            key={event._id}
            className="group"
          >
            <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-[420px] flex flex-col">
              {/* Event Image */}
              {event.image ? (
                <Image
                  width={600}
                  height={400}
                  src={`${event.image}`}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                  <TicketX size={42} />
                </div>
              )}

              {/* Event Info */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-primary-hover transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {event.time}
                  </p>
                  <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
