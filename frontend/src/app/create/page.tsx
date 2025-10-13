"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  Ticket,
  Pi,
  Link as LinkIcon,
  Loader2,
  Wallet,
} from "lucide-react";
import { postRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/alert";
import { uploadToCloudinary } from "@/utils/upload";

function Clock({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-clock"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  meetingType: "physical" | "online";
  location: string;
  capacity: string;
  ticketType: "free" | "paid";
  price: string;
  image: File | null;
}

export default function CreateEvent() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    address: "",
    time: "",
    meetingType: "physical",
    location: "",
    capacity: "",
    ticketType: "paid",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;

    // Only file inputs have the 'files' property
    const files = target instanceof HTMLInputElement ? target.files : null;

    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (formData.image) {
        const imageUrl = await uploadToCloudinary(formData.image);
        if (!imageUrl) {
          setMessage("❌ Failed to upload image");
          setLoading(false);
          return;
        }

        const eventPayload = {
          eventDetails: {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            meetingType: formData.meetingType,
            location: formData.location,
            address: formData.address,
            image: imageUrl,
            capacity: formData.capacity,
            ticketType: formData.ticketType,
            price: formData.price,
          },
        };

        const response = await postRequest("/event/create", eventPayload);

        if (response?.success) {
          setMessage("Event created successfully");
          // delay navigation by 1s to allow the success message to be seen
          setTimeout(() => {
            router.push(`/events/${response.event.eventId}`);
          }, 1000);
        } else {
          throw new Error(response?.message || "Failed to create event");
        }
      }
    } catch (err) {
      setMessage(`❌ ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/20 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center font-antiqua">
        Create an Event
      </h2>

      {message === "Event created successfully" ? (
        <Alert
          type="success"
          title="Success"
          text="Event Created Successfully, you will be redirected shortly"
        />
      ) : message === "Request failed with status 401" ? (
        <Alert
          type="primary"
          title="Auth error"
          text="pls, sign in before performing this action"
        />
      ) : message === "" ? (
        ""
      ) : (
        <Alert
          type="primary"
          title="Network error"
          text="pls, try again later"
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white w-[95%] sm:w-4/5 md:w-2/3 lg:w-1/2 border border-border rounded-2xl shadow-lg p-6 md:p-8 transition hover:shadow-xl"
      >
        {/* Title */}
        <Label title="Event Title" />
        <Input
          name="title"
          placeholder="e.g. MorphCon 2025"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <Label title="Description" className="mt-6" />
        <Textarea
          name="description"
          placeholder="Describe your event..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Date & Time */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div>
            <Label icon={<Calendar size={18} />} title="Date" />
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label icon={<Clock size={18} />} title="Time" />
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Meeting Type */}
        <Label
          icon={<MapPin size={18} />}
          title="Meeting Type"
          className="mt-6"
        />
        <Select
          name="meetingType"
          value={formData.meetingType}
          onChange={handleChange}
          options={[
            { value: "physical", label: "Physical" },
            { value: "online", label: "Online" },
          ]}
        />

        {/* Location / Link */}
        {formData.meetingType === "physical" ? (
          <>
            <Label
              icon={<MapPin size={18} />}
              title="Venue Address"
              className="mt-6"
            />
            <Input
              name="location"
              placeholder="e.g. Landmark Centre, Lagos"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <Label
              icon={<LinkIcon size={18} />}
              title="Meeting Link"
              className="mt-6"
            />
            <Input
              type="url"
              name="location"
              placeholder="e.g. https://zoom.us/j/123456789"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Only visible after registration.
            </p>
          </>
        )}

        {/* Capacity */}
        <Label icon={<Users size={18} />} title="Capacity" className="mt-6" />
        <Input
          type="number"
          name="capacity"
          placeholder="e.g. 500"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        {/* Ticket Type */}
        <Label
          icon={<Ticket size={18} />}
          title="Ticket Type"
          className="mt-6"
        />
        <Select
          name="ticketType"
          value={formData.ticketType}
          onChange={handleChange}
          options={[
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" },
          ]}
        />

        {/* Price */}
        {formData.ticketType === "paid" && (
          <>
            <Label
              icon={<Pi size={18} />}
              title="Ticket Price"
              className="mt-6"
            />
            <Input
              type="number"
              name="price"
              placeholder="e.g. 20"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Image Upload */}
        <Label
          icon={<ImageIcon size={18} />}
          title="Event Banner"
          className="mt-6"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full mt-2 text-sm p-2 border border-border rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
        />

        {/* Image Upload */}
        <Label
          icon={<Wallet size={18} />}
          title="Pi wallet address"
          className="mt-6"
        />
        <input
          type="address"
          name="address"
          placeholder="....."
          value={formData.address}
          onChange={handleChange}
          className="w-full mt-2 text-sm p-2 border border-border rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-70 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Creating...
            </>
          ) : (
            "Create Event"
          )}
        </button>
      </form>
    </div>
  );
}

/* ------------------------- Subcomponents ------------------------- */
function Label({
  title,
  icon,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={` font-semibold text-primary flex items-center gap-2 ${
        className || ""
      }`}
    >
      {icon} {title}
    </label>
  );
}

interface InputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function Input({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full mt-2 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
    />
  );
}

interface TextareaProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

function Textarea({
  name,
  placeholder,
  value,
  onChange,
  required,
}: TextareaProps) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full mt-2 p-3 border border-border rounded-md h-32 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
    />
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
}

function Select({ name, value, onChange, options }: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-2 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
