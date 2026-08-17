import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Please enter your first name"),
  surname: z.string().min(2, "Please enter your surname"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  date: z.string().min(1, "Please choose a date"),
  time: z.string().min(1, "Please choose a time"),
  guests: z
    .number()
    .int()
    .min(1, "At least one guest")
    .max(20, "For parties larger than 20, please request a private event quote"),
  seating: z.enum(["indoor", "outdoor"]),
  occasion: z.string().optional(),
  specialRequests: z
    .string()
    .max(500, "Please keep special requests under 500 characters")
    .optional(),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

export const ticketOrderSchema = z.object({
  eventSlug: z.string().min(1),
  quantity: z
    .number()
    .int()
    .min(1, "At least one ticket")
    .max(10, "Maximum 10 tickets per order"),
  name: z.string().min(2, "Please enter your first name"),
  surname: z.string().min(2, "Please enter your surname"),
  // Guests save/print their own ticket, so email is a nice-to-have, not
  // required — but if they do type one it must be a real address.
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
});

export type TicketOrderFormValues = z.infer<typeof ticketOrderSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const quoteRequestSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(9, "Please enter a valid phone number"),
  eventType: z.string().min(1, "Please choose an event type"),
  guests: z.number().int().min(1).max(500),
  date: z.string().min(1, "Please choose a preferred date"),
  message: z.string().max(1000).optional(),
});

export type QuoteRequestFormValues = z.infer<typeof quoteRequestSchema>;
