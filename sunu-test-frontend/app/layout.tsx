import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';

const lexend = Lexend({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RÉASSURANCE",
  description: "RÉASSURANC test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} antialiased`}
      >
          <ToastContainer />
          {children}
      </body>
    </html>
  );
}
