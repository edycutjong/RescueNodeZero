import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RescueNode Zero — Air-Gapped Triage Intelligence",
  description:
    "When the grid goes dark, the AI stays on. Air-gapped multimodal triage hub powered by Actian VectorAI DB.",
  openGraph: {
    title: "RescueNode Zero",
    description: "Air-gapped AI triage intelligence hub for disaster responders",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
