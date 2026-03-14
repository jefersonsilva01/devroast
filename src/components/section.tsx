import { cn } from "@/lib/utils";

const SectionRoot = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div className={cn("flex w-full max-w-4xl flex-col gap-4", className)}>
			{children}
		</div>
	);
};

const SectionTitle = ({
	className,
	prefix = "//",
	children,
}: {
	className?: string;
	prefix?: string;
	children: React.ReactNode;
}) => {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span className="font-mono text-sm font-bold text-accent-green">
				{prefix}
			</span>
			<span className="font-mono text-sm font-bold text-text-primary">
				{children}
			</span>
		</div>
	);
};

const SectionDescription = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<p className={cn("font-mono text-xs text-text-tertiary", className)}>
			{children}
		</p>
	);
};

const SectionContent = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return <div className={cn(className)}>{children}</div>;
};

export const Section = Object.assign(SectionRoot, {
	Title: SectionTitle,
	Description: SectionDescription,
	Content: SectionContent,
});
