import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "whitespace-nowrap font-medium tracking-wide uppercase",
    "transition-all duration-500 cursor-pointer select-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-3",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Solid gold-to-fire gradient — primary CTA */
        fire: [
          "text-[#1a1104] bg-[linear-gradient(120deg,#f4d67a,#d4af37_35%,#ff8a00_100%)]",
          "bg-[length:150%_auto] hover:bg-[position:100%_0]",
          "shadow-[0_0_28px_-6px_rgba(255,138,0,0.55)] hover:shadow-[0_0_44px_-4px_rgba(255,138,0,0.75)]",
          "hover:-translate-y-0.5 active:translate-y-0",
        ].join(" "),
        /** Gold outline — secondary CTA */
        outline: [
          "border border-gold/60 text-gold-light bg-transparent",
          "hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_28px_-8px_rgba(212,175,55,0.55)]",
          "hover:-translate-y-0.5 active:translate-y-0",
        ].join(" "),
        /** Quiet glass button */
        ghost: "glass text-foreground/90 hover:bg-white/10 hover:text-white",
        /** WhatsApp green */
        whatsapp:
          "bg-[#25d366] text-[#062b16] shadow-[0_0_30px_-6px_rgba(37,211,102,0.7)] hover:shadow-[0_0_46px_-4px_rgba(37,211,102,0.85)] hover:-translate-y-0.5",
        link: "text-gold underline-offset-4 hover:underline normal-case tracking-normal",
      },
      size: {
        sm: "h-9 px-4 text-[11px] rounded-full",
        default: "h-12 px-7 text-xs rounded-full",
        lg: "h-14 px-10 text-sm rounded-full",
        icon: "size-12 rounded-full",
      },
    },
    defaultVariants: { variant: "fire", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the single child element (e.g. a Link) with button styling. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
