"use client";

import { motion } from "framer-motion";
import { Users, Shield, Ticket, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mb-5">
      {/* Hero Section */}
      <section className="relative bg-primary/90 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            About <span className="text-white/90">Our Platform</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg text-white/90"
          >
            We simplify event experiences by connecting organizers and attendees
            through secure, smart, and seamless ticketing technology.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold mb-3 text-primary">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to redefine the event ticketing landscape by
              providing a reliable and transparent platform for discovering,
              purchasing, and managing event tickets. We empower organizers with
              smart tools and attendees with effortless access to memorable
              experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold mb-3 text-primary">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To be the leading event technology platform that unites people,
              culture, and innovation — fostering meaningful connections through
              well-organized events across the globe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 border-t">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10 text-primary">
            How Our Platform Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Calendar className="w-10 h-10 text-primary mb-3" />,
                title: "Plan Your Event",
                desc: "Organizers can create and publish events easily with full control over schedules, pricing, and attendance.",
              },
              {
                icon: <Ticket className="w-10 h-10 text-primary mb-3" />,
                title: "Buy or Scan Tickets",
                desc: "Attendees purchase tickets digitally and gain access through our secure QR verification system.",
              },
              {
                icon: <Shield className="w-10 h-10 text-primary mb-3" />,
                title: "Enjoy Seamless Entry",
                desc: "Our verification ensures authenticity and prevents duplication — delivering a safe, effortless event experience.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl shadow-sm p-8 border hover:shadow-md transition"
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-primary mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: (
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                ),
                title: "Integrity",
              },
              {
                icon: <Users className="w-8 h-8 text-primary mx-auto mb-3" />,
                title: "Community",
              },
              {
                icon: <Shield className="w-8 h-8 text-primary mx-auto mb-3" />,
                title: "Trust",
              },
              {
                icon: <Ticket className="w-8 h-8 text-primary mx-auto mb-3" />,
                title: "Innovation",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-2xl shadow-sm border"
              >
                {val.icon}
                <h3 className="font-semibold text-lg">{val.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <h2 className="text-3xl font-semibold mb-3">
          Join the Future of Event Ticketing
        </h2>
        <p className="text-white/90 mb-6">
          Whether you’re hosting or attending — experience smarter, faster, and
          more secure ticketing.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
