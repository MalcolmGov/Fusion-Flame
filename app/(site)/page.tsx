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
  getWhatsAppLink,
} from "@/services/content";

const ORDER_MESSAGE = "Hi Fusion Flame, I'd like to place an order.";

export default async function HomePage() {
  const [menu, signatureDishes, gallery, events, testimonials, restaurant, orderHref] =
    await Promise.all([
      getMenu(),
      getSignatureDishes(),
      getGallery(),
      getEvents(),
      getTestimonials(),
      getRestaurant(),
      getWhatsAppLink(ORDER_MESSAGE),
    ]);

  return (
    <>
      <LoadingScreen />
      <Hero backgroundImage={restaurant.heroImage} orderHref={orderHref} />
      <About />
      <MenuSection categories={menu} orderHref={orderHref} />
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
