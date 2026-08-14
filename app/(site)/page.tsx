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

/** Flip to true once the owner's full menu and pricing are loaded. */
const SHOW_MENU_SECTION = false;

/** Flip to true once the owner signs off the private-events offering. */
const SHOW_PRIVATE_EVENTS = false;

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
        hasMenu={SHOW_MENU_SECTION && menu.length > 0}
      />
      <About />
      {SHOW_MENU_SECTION && menu.length > 0 && (
        <MenuSection categories={menu} orderHref={orderHref} />
      )}
      {signatureDishes.length > 0 && <SignatureCarousel dishes={signatureDishes} />}
      {gallery.length > 0 && <GallerySection images={gallery} />}
      <EventsSection events={events} />
      <Reservations />
      {SHOW_PRIVATE_EVENTS && <PrivateEvents />}
      <InstagramFeed />
      <Contact />
    </>
  );
}
