import type { Metadata } from "next";
import "../globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Admin | TruBooker",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

          <LayoutWrapper>
            {children} <Toaster />
          </LayoutWrapper>

  );
}
