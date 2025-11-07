import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import CustomLayout from "@/custom-layout";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Blood Donation App",
  description: "A web application for managing blood donations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <CustomLayout>{children}</CustomLayout>
        <Toaster />
      </body>
    </html>
  );
}
