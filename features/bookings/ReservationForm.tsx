"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarCheck2, PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Input,
  Label,
  Select,
  Textarea,
  FieldError,
} from "@/components/ui/form-fields";
import { reservationSchema, type ReservationFormValues } from "@/lib/validation";
import type { ReservationConfirmation } from "@/types";

const OCCASIONS = [
  "None — just great food",
  "Birthday",
  "Anniversary",
  "Corporate",
  "Wedding",
  "Other Celebration",
];

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

async function submitReservation(
  values: ReservationFormValues,
): Promise<ReservationConfirmation> {
  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Reservation failed");
  }
  return res.json();
}

export function ReservationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2, seating: "indoor" },
  });

  const mutation = useMutation({ mutationFn: submitReservation });

  const minDate = new Date().toISOString().split("T")[0];

  if (mutation.isSuccess) {
    const { reference, reservation } = mutation.data;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        className="gold-ring mx-auto max-w-xl rounded-3xl p-8 text-center md:p-12"
      >
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold shadow-glow-gold">
          <PartyPopper className="size-8" aria-hidden />
        </span>
        <h3 className="font-heading mt-6 text-3xl text-gold-gradient">
          Your Table Awaits
        </h3>
        <p className="mt-3 leading-relaxed text-muted">
          Thank you, {reservation.name}. We've received your reservation for{" "}
          <strong className="text-foreground">
            {reservation.guests} {reservation.guests === 1 ? "guest" : "guests"}
          </strong>{" "}
          on{" "}
          <strong className="text-foreground">
            {new Date(reservation.date).toLocaleDateString("en-ZA", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </strong>{" "}
          at <strong className="text-foreground">{reservation.time}</strong> —{" "}
          {reservation.seating} seating.
        </p>
        <p className="mt-4 text-sm text-muted">
          Booking reference{" "}
          <span className="font-mono text-gold-light">{reference}</span>. A
          confirmation is on its way to {reservation.email}.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            mutation.reset();
            reset();
          }}
        >
          <RotateCcw className="size-4" aria-hidden />
          Make Another Reservation
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="gold-ring mx-auto max-w-3xl rounded-3xl p-7 md:p-10"
      noValidate
      aria-label="Reservation form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="res-name">Name</Label>
          <Input
            id="res-name"
            placeholder="Amara"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="res-surname">Surname</Label>
          <Input
            id="res-surname"
            placeholder="Nkosi"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.surname)}
            {...register("surname")}
          />
          <FieldError message={errors.surname?.message} />
        </div>
        <div>
          <Label htmlFor="res-email">Email</Label>
          <Input
            id="res-email"
            type="email"
            placeholder="amara@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="res-phone">Phone</Label>
          <Input
            id="res-phone"
            type="tel"
            placeholder="+27 82 000 0000"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="res-date">Date</Label>
          <Input
            id="res-date"
            type="date"
            min={minDate}
            aria-invalid={Boolean(errors.date)}
            className="[color-scheme:dark]"
            {...register("date")}
          />
          <FieldError message={errors.date?.message} />
        </div>
        <div>
          <Label htmlFor="res-time">Time</Label>
          <Select
            id="res-time"
            aria-invalid={Boolean(errors.time)}
            defaultValue=""
            {...register("time")}
          >
            <option value="" disabled>
              Choose a time
            </option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <FieldError message={errors.time?.message} />
        </div>
        <div>
          <Label htmlFor="res-guests">Guests</Label>
          <Select
            id="res-guests"
            aria-invalid={Boolean(errors.guests)}
            {...register("guests", { setValueAs: (v) => Number(v) })}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </Select>
          <FieldError message={errors.guests?.message} />
        </div>
        <div>
          <Label htmlFor="res-seating">Seating</Label>
          <Select id="res-seating" {...register("seating")}>
            <option value="indoor">Indoor — by the hearth</option>
            <option value="outdoor">Outdoor — terrace</option>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="res-occasion">Occasion</Label>
          <Select id="res-occasion" defaultValue={OCCASIONS[0]} {...register("occasion")}>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="res-requests">Special Requests</Label>
          <Textarea
            id="res-requests"
            placeholder="Allergies, celebrations, favourite table…"
            aria-invalid={Boolean(errors.specialRequests)}
            {...register("specialRequests")}
          />
          <FieldError message={errors.specialRequests?.message} />
        </div>
      </div>

      {mutation.isError ? (
        <p role="alert" className="mt-5 text-sm text-flame-red">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Something went wrong — please try again."}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={mutation.isPending}
        className="mt-8 w-full"
      >
        <CalendarCheck2 className="size-4" aria-hidden />
        {mutation.isPending ? "Securing your table…" : "Reserve My Table"}
      </Button>
      <p className="mt-4 text-center text-xs text-muted/70">
        Free cancellation up to 6 hours before your booking.
      </p>
    </form>
  );
}
