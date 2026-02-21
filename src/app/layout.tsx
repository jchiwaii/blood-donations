import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import CustomLayout from "@/custom-layout";

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
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
      </head>
      <body className="font-sans antialiased">
        <CustomLayout>{children}</CustomLayout>
        <Toaster />
      </body>
    </html>
  );
}
