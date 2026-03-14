import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badgeVariants = tv({
	base: "inline-flex items-center gap-1 rounded-md font-mono text-xs font-medium",
	variants: {
		variant: {
			default: "bg-bg-surface text-text-primary",
			secondary: "bg-zinc-800 text-zinc-100",
			success: "bg-accent-green/10 text-accent-green",
			warning: "bg-accent-amber/10 text-accent-amber",
			error: "bg-accent-red/10 text-accent-red",
			outline:
				"border border-border-primary bg-transparent text-text-secondary",
		},
		size: {
			default: "px-2 py-1",
			sm: "px-1.5 py-0.5 text-[10px]",
			lg: "px-3 py-1.5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<div
				className={cn(badgeVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Badge.displayName = "Badge";
