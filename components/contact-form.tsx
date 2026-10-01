"use client";

import { useState, type FormEvent } from "react";

const topics = ["Real estate — buying", "Real estate — selling", "Editorial / journalism", "Other"];

const field =
  "mt-3 block w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-ink placeholder:text-stone/70 focus:border-olive focus:ring-0 focus:outline-none";
const labelCls = "text-[0.68rem] font-semibold tracking-[0.22em] text-stone uppercase";

/**
 * Zero-cost contact form: composes an email in the visitor's mail app.
 * No server, no third-party service, no stored data. It can be swapped for
 * a server action + Resend later without changing the markup.
 */
export function ContactForm({ email }: { email?: string }) {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    const data = new FormData(event.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `${get("topic")} — ${get("name")}`;
    const body = [
      get("message"),
      "",
      "—",
      get("name"),
      get("email"),
      get("phone"),
    ]
      .filter((line, i) => line || i < 3)
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 sm:grid-cols-2" aria-describedby="form-note">
      <div>
        <label htmlFor="name" className={labelCls}>
          Name
        </label>
        <input id="name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="phone" className={labelCls}>
          Phone <span className="tracking-normal normal-case">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div>
        <label htmlFor="topic" className={labelCls}>
          Regarding
        </label>
        <select id="topic" name="topic" className={field} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelCls}>
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={`${field} resize-y`} />
      </div>

      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="max-w-sm text-sm text-stone" aria-live="polite">
          {!email
            ? "[Email address needed before this form can be used.]"
            : sent
              ? "Your email app should now be open with your message ready to send."
              : "Sending opens your email app with the message ready to go."}
        </p>
        <button
          type="submit"
          disabled={!email}
          className="group inline-flex items-center justify-center gap-4 bg-ink px-9 py-5 text-[0.72rem] font-semibold tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send message
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
