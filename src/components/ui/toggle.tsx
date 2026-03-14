import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

export interface ToggleProps {
	pressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export function Toggle({
	pressed,
	onPressedChange,
	disabled,
	className,
	children,
	...props
}: ToggleProps) {
	return (
		<TogglePrimitive.Root
			pressed={pressed}
			onPressedChange={onPressedChange}
			disabled={disabled}
			className={cn(
				"inline-flex items-center gap-[10px] rounded-md font-mono text-[13px] font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			{/* Toggle Track */}
			<div
				className={cn(
					"flex h-[22px] w-[40px] items-center rounded-full bg-accent-green p-[3px]",
					pressed ? "justify-end" : "justify-start",
				)}
			>
				{/* Toggle Knob */}
				<div className="h-4 w-4 rounded-full bg-zinc-950" />
			</div>

			{/* Label */}
			<span
				className={cn(
					"transition-colors",
					pressed ? "text-accent-green" : "text-text-tertiary",
				)}
			>
				{children}
			</span>
		</TogglePrimitive.Root>
	);
}

Toggle.displayName = "Toggle";
