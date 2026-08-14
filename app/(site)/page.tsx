import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { MenuSection } from "@/features/menu/MenuSection";
import { SignatureCarousel } from "@/features/menu/SignatureCarousel";
import { GallerySection } from "@/features/gallery/GallerySection";
import { EventsSection } from "@/features/events/EventsSection";
import { PrivateEvents } from "@/components/sections/PrivateEvents";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { Reservations } from "@/components/sections/Reservations";
import { Contact } from "@/components/sections/Contact";
import {
  getEvents,
  getGallery,
  getMenu,
  getRestaurant,
  getSignatureDishes,
  getWhatsAppLink,
} from "@/services/content";

const ORDER_MESSAGE = "Hi Fusion Flame, I'd like to place an order.";

export default async function HomePage() {
  const [menu, signatureDishes, gallery, events, restaurant, orderHref] =
    await Promise.all([
      getMenu(),
      getSignatureDishes(),
      getGallery(),
      getEvents(),
      getRestaurant(),
      getWhatsAppLink(ORDER_MESSAGE),
    ]);

  return (
    <>
      <LoadingScreen />
      <Hero
        backgroundImage={restaurant.heroImage}
        orderHref={orderHref}
        hasMenu={menu.length > 0}
      />
      <About />
      {menu.length > 0 && <MenuSection categories={menu} orderHref={orderHref} />}
      {signatureDishes.length > 0 && <SignatureCarousel dishes={signatureDishes} />}
      {gallery.length > 0 && <GallerySection images={gallery} />}
      <EventsSection events={events} />
      <Reservations />
      <PrivateEvents />
      <InstagramFeed />
      <Contact />
    </>
  );
}
