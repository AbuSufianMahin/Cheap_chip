import { TooltipProvider } from "@/components/ui/tooltip"
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import OrderChatbot from "@/components/shared/OrderChatbot";

const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400'] });

export const metadata = {
  title: "Cheap Chip",
  description: "A project to help you recycle your used products",
  icons: {
    icon: '/images/cheap_chip_3Dlogo.webp'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body
        className={`${dm_sans.className} antialiased`}
      >
        <main>
          <Toaster position="top-center" richColors />
          <TooltipProvider>{children}</TooltipProvider>
          <OrderChatbot />
        </main>
      </body>
    </html>
  );
}
