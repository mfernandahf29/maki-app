import { Righteous, Nunito_Sans } from "next/font/google";
import "./globals.css";

const righteous = Righteous({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-righteous",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata = {
  title: "MAKI - Plataforma Educativa",
  description: "Plataforma educativa gamificada para CEBE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${righteous.variable} ${nunitoSans.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-body-md bg-gradient-to-br from-surface to-surface-dim">
        {children}
      </body>
    </html>
  );
}
