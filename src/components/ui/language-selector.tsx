import { type LanguageId, SUPPORTED_LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";

const LanguageSelectorRoot = ({
	className,
	value,
	onChange,
}: {
	className?: string;
	value: LanguageId | "auto";
	onChange: (value: LanguageId | "auto") => void;
}) => {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value as LanguageId | "auto")}
			className={cn(
				"rounded-md border border-border-primary bg-bg-surface px-2 py-1 font-mono text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green",
				className,
			)}
		>
			<option value="auto">auto</option>
			{SUPPORTED_LANGUAGES.map((lang) => (
				<option key={lang.id} value={lang.id}>
					{lang.name}
				</option>
			))}
		</select>
	);
};

const LanguageSelectorLabel = ({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<span className={cn("font-mono text-xs text-text-tertiary", className)}>
			{children}
		</span>
	);
};

export const LanguageSelector = Object.assign(LanguageSelectorRoot, {
	Label: LanguageSelectorLabel,
});
