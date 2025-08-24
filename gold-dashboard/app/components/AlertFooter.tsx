"use client";

import { useState } from "react";

export default function FooterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // very basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <footer className="p-6 border-t">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Subscribe
        </button>
      </form>

      {status === "success" && <p className="text-green-600 mt-2">Thanks for subscribing!</p>}
      {status === "error" && <p className="text-red-600 mt-2">Invalid or already subscribed.</p>}
    </footer>
  );
}