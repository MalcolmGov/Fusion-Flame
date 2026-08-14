import { SectionHeading } from "@/components/effects/SectionHeading";
import { Reveal } from "@/components/effects/Reveal";
import { ReservationForm } from "@/features/bookings/ReservationForm";
import { getRestaurant } from "@/services/content";

export async function Reservations() {
  const { whatsapp } = await getRestaurant();
  return (
    <section
      id="reservations"
      className="fire-ambience relative scroll-mt-24 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Reservations"
          title="Reserve Your Moment"
          description="Choose your evening — we'll have the fire burning and the glasses polished."
        />
        <Reveal>
          <ReservationForm whatsappNumber={whatsapp} />
        </Reveal>
      </div>
    </section>
  );
}
