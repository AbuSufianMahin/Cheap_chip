import { Alegreya } from "next/font/google";
import Image from "next/image";

const alegreya = Alegreya({
  subsets: ["latin"],
});

function Logo({className}) {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src="/images/cheap_chip_3Dlogo.webp"
        width={48}
        height={48}
        alt="Logo of Cheap Chip"
      />
      <h1 className={`${alegreya.className} text-center text-2xl font-extrabold leading-none`}>
        Cheap
        <br />
        Chip
      </h1>
    </div>
  );
}

export default Logo;
