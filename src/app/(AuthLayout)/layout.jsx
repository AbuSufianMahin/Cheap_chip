import Logo from "@/components/shared/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alegreya } from "next/font/google";
import Image from "next/image";

const alegreya = Alegreya({
  subsets: ["latin"],
});

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="relative hidden lg:flex items-center justify-center bg-primary">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={"/images/cheap_chip_3Dlogo.webp"}
              width={200}
              height={200}
              alt="Cheap Chip logo"
              priority
            />
            <h1
              className={`${alegreya.className} text-4xl font-bold text-white `}
            >
              Cheap Chip
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex-1 flex flex-col items-center mt-14 lg:mt-0 lg:justify-center">
            <Tooltip>
              <TooltipTrigger>
                <Logo />
              </TooltipTrigger>
              <TooltipContent side={"bottom"}>
                <p>Go to home</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default AuthLayout;
