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
      <body className="font-sans antialiased">
        <CustomLayout>{children}</CustomLayout>
        <Toaster />
      </body>
    </html>
  );
}
