"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  amount?: string;
  message?: string;
};

export default function DonationForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(form: FormData): FieldErrors {
    const errs: FieldErrors = {};

    const name = (form.get("name") as string)?.trim();
    if (!name) {
      errs.name = "Name is required.";
    } else if (name.length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    const email = (form.get("email") as string)?.trim();
    if (!email) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }

    const phone = (form.get("phone") as string)?.trim();
    if (!phone) {
      errs.phone = "Phone number is required.";
    } else if (!/^[+]?[\d\s()-]{7,20}$/.test(phone)) {
      errs.phone = "Please enter a valid phone number.";
    }

    const amount = (form.get("amount") as string)?.trim();
    if (!amount) {
      errs.amount = "Donation amount is required.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
      errs.amount = "Please enter a valid amount greater than 0.";
    }

    const message = (form.get("message") as string)?.trim();
    if (!message) {
      errs.message = "Please include a message.";
    } else if (message.length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }

    return errs;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldErrors = validate(formData);

    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) return;

    // All validations passed
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center rounded-[22px] border border-[#e5e8f1] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            Thank you for your donation!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve received your submission and will be in touch soon.
          </p>
          <Button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 h-11 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-7 text-sm text-white"
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-[18px] rounded-[22px] border border-[#e5e8f1] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)] sm:gap-5 sm:p-8"
    >
      <div>
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            name="name"
            type="text"
            placeholder="Name"
            className={`h-14 w-full rounded-[999px] border bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40 ${errors.name ? "border-red-400" : "border-[#ebeef7]"}`}
          />
        </label>
        {errors.name && (
          <p className="mt-1.5 px-6 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block">
          <span className="sr-only">Email Address</span>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className={`h-14 w-full rounded-[999px] border bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40 ${errors.email ? "border-red-400" : "border-[#ebeef7]"}`}
          />
        </label>
        {errors.email && (
          <p className="mt-1.5 px-6 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block">
          <span className="sr-only">Phone</span>
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            className={`h-14 w-full rounded-[999px] border bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40 ${errors.phone ? "border-red-400" : "border-[#ebeef7]"}`}
          />
        </label>
        {errors.phone && (
          <p className="mt-1.5 px-6 text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block">
          <span className="sr-only">Donation Amount</span>
          <input
            name="amount"
            type="text"
            placeholder="Donation Amount"
            className={`h-14 w-full rounded-[999px] border bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40 ${errors.amount ? "border-red-400" : "border-[#ebeef7]"}`}
          />
        </label>
        {errors.amount && (
          <p className="mt-1.5 px-6 text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block">
          <span className="sr-only">Your Message</span>
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            className={`w-full rounded-[28px] border bg-[#f9f9fb] px-6 py-4 text-sm outline-none transition focus:border-primary/40 ${errors.message ? "border-red-400" : "border-[#ebeef7]"}`}
          />
        </label>
        {errors.message && (
          <p className="mt-1.5 px-6 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-7 text-sm text-white"
      >
        Donate Now
      </Button>
    </form>
  );
}
