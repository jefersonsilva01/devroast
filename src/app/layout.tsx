import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
	title: "devroast - Paste your code. Get roasted.",
	description:
		"Drop your code below and we'll rate it — brutally honest or full roast mode",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Navbar />
				{children}
			</body>
		</html>
	);
}
