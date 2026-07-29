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
  getRestaurant,
  getSignatureDishes,
  getTestimonials,
} from "@/services/content";

export default async function HomePage() {
  const [menu, signatureDishes, gallery, events, testimonials, restaurant] =
    await Promise.all([
      getMenu(),
      getSignatureDishes(),
      getGallery(),
      getEvents(),
      getTestimonials(),
      getRestaurant(),
    ]);

  return (
    <>
      <LoadingScreen />
      <Hero backgroundImage={restaurant.heroImage} />
      <About />
      <MenuSection categories={menu} />
      <SignatureCarousel dishes={signatureDishes} />
      <GallerySection images={gallery} />
      <EventsSection events={events} />
      <Reservations />
      <PrivateEvents />
      <Testimonials testimonials={testimonials} />
      <Chef />
      <Offers />
      <Loyalty />
      <InstagramFeed />
      <Newsletter />
      <Contact />
    </>
  );
}
