import { DM_Sans } from "next/font/google";
import "./globals.css";

const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400'] });

export const metadata = {
  title: "Cheap Chip",
  description: "A project to help you recycle your used products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dm_sans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
