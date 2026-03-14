import { cn } from "@/lib/utils";

const DiffBlockRoot = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-md border border-border-primary bg-bg-input",
				className,
			)}
		>
			{children}
		</div>
	);
};

const DiffBlockHeader = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"flex items-center gap-2 border-b border-border-primary px-4 py-2",
				className,
			)}
		>
			{children}
		</div>
	);
};

const DiffBlockTitle = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<span
			className={cn("font-mono text-sm font-bold text-accent-green", className)}
		>
			{children}
		</span>
	);
};

const DiffBlockContent = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return <div className={cn("p-1", className)}>{children}</div>;
};

export const DiffBlock = Object.assign(DiffBlockRoot, {
	Header: DiffBlockHeader,
	Title: DiffBlockTitle,
	Content: DiffBlockContent,
});
