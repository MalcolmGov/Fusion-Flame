import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { MenuSection } from "@/features/menu/MenuSection";
import { SignatureCarousel } from "@/features/menu/SignatureCarousel";
import { GallerySection } from "@/features/gallery/GallerySection";
import { EventsSection } from "@/features/events/EventsSection";
import { PrivateEvents } from "@/components/sections/PrivateEvents";
import { Testimonials } from "@/components/sections/Testimonials";
import { Chef } from "@/components/sections/Chef";
import { Offers } from "@/components/sections/Offers";
import { Loyalty } from "@/components/sections/Loyalty";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { Newsletter } from "@/components/sections/Newsletter";
import { Reservations } from "@/components/sections/Reservations";
import { Contact } from "@/components/sections/Contact";
import {
  getEvents,
  getGallery,
  getMenu,
  getSignatureDishes,
  getTestimonials,
} from "@/services/content";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Hero />
      <About />
      <MenuSection categories={getMenu()} />
      <SignatureCarousel dishes={getSignatureDishes()} />
      <GallerySection images={getGallery()} />
      <EventsSection events={getEvents()} />
      <Reservations />
      <PrivateEvents />
      <Testimonials testimonials={getTestimonials()} />
      <Chef />
      <Offers />
      <Loyalty />
      <InstagramFeed />
      <Newsletter />
      <Contact />
    </>
  );
}
