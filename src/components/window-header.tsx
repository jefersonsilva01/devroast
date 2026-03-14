import { cn } from "@/lib/utils";

export interface WindowHeaderProps {
	className?: string;
}

export function WindowHeader({ className }: WindowHeaderProps) {
	return (
		<div
			className={cn(
				"flex h-10 w-full items-center gap-2 border-b border-border-primary px-4",
				className,
			)}
		>
			<div className="flex gap-2">
				<div className="h-3 w-3 rounded-full bg-accent-red" />
				<div className="h-3 w-3 rounded-full bg-accent-amber" />
				<div className="h-3 w-3 rounded-full bg-accent-green" />
			</div>
		</div>
	);
}
