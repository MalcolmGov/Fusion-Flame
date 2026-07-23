import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="fire-ambience flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <Image
        src="/logo.jpeg"
        alt=""
        width={140}
        height={140}
        className="mix-blend-screen opacity-90"
      />
      <h1 className="font-heading mt-6 text-5xl text-gold-gradient md:text-6xl">
        Lost in the Smoke
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        The page you&rsquo;re looking for has drifted off like an ember.
        Let&rsquo;s get you back to the fire.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
