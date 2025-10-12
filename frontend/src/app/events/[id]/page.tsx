"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users, Ticket, Pi } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { getRequest, postRequest } from "@/utils/api";
import Alert from "@/components/ui/alert";

type MyPaymentMetadata = Record<string, unknown>;

interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

interface EventData {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  meetingType: string;
  date: string;
  time: string;
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

export default function EventDetails() {
  const { user } = useAuthStore();
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false); // ✅ new state
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  interface Registration {
    _id: string;
    username: string;
    user?: {
      username?: string;
      email?: string;
    };
  }

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const data = await getRequest(`/event/get/${eventId}`);
        setEvent(data);
        if (user?.username && data.organizer.username === user.username) {
          const regs = await getRequest(`/event/registrations/${eventId}`);
          setRegistrations(regs.registrations as Registration[]);
        }

        // ✅ Check if user is already registered
        const check = await getRequest(`/event/check-registration/${eventId}`);
        setRegistered(check?.registered || false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load event";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  const buyTicket = async (
    memo: string,
    amount: number,
    paymentMetadata: MyPaymentMetadata
  ) => {
    if (!user) {
      setShowModal(true);
      return;
    }

    const paymentData = { amount, memo, metadata: paymentMetadata };

    const callbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        try {
          console.log("onReadyForServerApproval", paymentId);
          const res = await postRequest("/payments/approve", { paymentId });
          setMessage("✅ Payment approved successfully!");
          console.log("Server approval response:", res);
        } catch (err: unknown) {
          console.error("❌ Failed to approve payment:", err);
          setMessage("❌ Payment approval failed. Try again.");
        }
      },

      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        try {
          console.log("onReadyForServerCompletion", paymentId, txid);
          const res = await postRequest("/payments/complete", {
            paymentId,
            txid,
          });
          setMessage("✅ Payment completed successfully!");
          console.log("Server completion response:", res);
          setRegistered(true); // mark user as registered after successful payment
        } catch (err: unknown) {
          console.error("❌ Failed to complete payment:", err);
          setMessage("❌ Payment completion failed. Contact support.");
        }
      },

      onCancel: async (paymentId?: string) => {
        try {
          console.log("onCancel", paymentId);
          if (paymentId) {
            await postRequest("/payments/cancelled_payment", { paymentId });
          }
          setMessage("⚠️ Payment cancelled.");
        } catch (err: unknown) {
          console.error("❌ Failed to notify server of cancellation:", err);
        }
      },

      onError: (error: Error, payment?: PaymentDTO) => {
        console.error("onError", error);
        if (payment) console.log("Payment info at error:", payment);
        setMessage(`❌ Payment error: ${error.message}`);
      },
    };

    // Start the Pi payment
    try {
      if (!window.Pi?.createPayment) {
        throw new Error("Pi Network SDK not available");
      }
      window.Pi.createPayment(paymentData, callbacks);
    } catch (err: unknown) {
      console.error("❌ Failed to create Pi payment:", err);
      setMessage("❌ Failed to start payment. Try again.");
    }
  };

  const handleRegister = async () => {
    if (!eventId) return;
    setRegistering(true);
    setMessage(null);

    if (event?.ticketType === "free") {
      try {
        const data = await postRequest(`/event/register`, { eventId: eventId });
        setMessage(data.message || "✅ Successfully registered!");
        setRegistered(true); // ✅ Mark as registered
      } catch (err: unknown) {
        const errMsg =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "❌ Failed to register for event";
        setMessage(errMsg);
      } finally {
        setRegistering(false);
      }
    } else {
      try {
        if (!event) {
          throw new Error("Event not found");
        }
        const memo = event.description ?? "";
        const amount = event.price ?? 0;
        const metadata: MyPaymentMetadata = {
          eventId: event.eventId ?? "",
          price: amount,
        };
        await buyTicket(memo, amount, metadata);
      } catch (err: unknown) {
        const errMsg =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "❌ Failed to register for event";
        setMessage(errMsg);
      } finally {
        setRegistering(false);
      }
    }
  };

  if (loading) return <Alert type="warning" title="" text="Loading event..." />;
  if (error) return <Alert type="primary" title="Error" text={error} />;
  if (!event)
    return <Alert type="primary" title="Error" text="No Event Found" />;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/20 py-10">
      {showModal && (
        <Alert type="primary" title="Auth error" text="Login again pls" />
      )}
      <div className="bg-white border border-border rounded-2xl shadow-lg p-8 w-11/12 md:w-2/3 lg:w-1/2">
        {event.image && (
          <Image
            src={`https://tiketa-51fb.onrender.com/uploads/${event.image}`}
            alt={event.title}
            width={800}
            height={400}
            unoptimized
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <h2 className="text-3xl font-bold text-primary mb-4 font-antiqua">
          {event.title}
        </h2>

        <p className="text-muted-foreground mb-6">{event.description}</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>
              {!registered && event.location === "online"
                ? `${event.location} "at" ${event.location}`
                : `${event.location} "at" ${event.location}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{event.capacity} capacity</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket size={18} />
            <span>
              {event.ticketType === "free" ? (
                "Free Entry"
              ) : (
                <p className="mt-3 font-medium text-primary">
                  <Pi className="inline w-3" />
                  {(event.price || 0).toLocaleString()}
                </p>
              )}
            </span>
          </div>
        </div>

        {event.organizer?.username && (
          <p className="mt-6 text-sm text-muted-foreground">
            Organized by <b>{event.organizer.username}</b>
          </p>
        )}

        {user?.username && event.organizer?.username === user?.username ? (
          // 👇 Organizer view
          <div className="mt-8">
            <p className="text-lg font-semibold">
              {registrations.length}{" "}
              {registrations.length === 1 ? "person" : "people"} registered
            </p>
            <ul className="mt-3 space-y-1">
              {registrations.map((reg) => (
                <li key={reg._id} className="text-sm text-muted-foreground">
                  {reg?.username || "Unknown User"}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // 👇 Attendee view
          <div className="mt-8 flex justify-center">
            {registered ? (
              <button
                disabled
                className="px-6 py-3 rounded-full font-medium bg-muted text-muted-foreground cursor-not-allowed"
              >
                Registered
              </button>
            ) : (
              <button
                onClick={() => handleRegister()}
                disabled={registering}
                className={`px-6 py-3 rounded-full font-medium transition ${
                  registering
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {registering ? "Registering..." : "Register"}
              </button>
            )}
          </div>
        )}

        {/* ✅ Feedback message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("❌")
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
