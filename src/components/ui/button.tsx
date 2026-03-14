import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center gap-2 rounded-md font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			primary: "bg-accent-green text-zinc-950 hover:bg-accent-green/90",
			secondary: "bg-bg-surface text-text-primary hover:bg-border-primary",
			outline:
				"border border-border-primary bg-transparent hover:bg-bg-surface",
			ghost: "hover:bg-bg-surface",
			destructive: "bg-accent-red text-white hover:bg-accent-red/90",
		},
		size: {
			default: "px-6 py-2.5",
			sm: "px-4 py-1.5 text-xs",
			lg: "px-8 py-3 text-base",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "default",
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
