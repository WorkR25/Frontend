import Image from "next/image";

export default function SignUpHero() {
  return (
    <div className="h-full w-full relative font-poppins">
      <span className="absolute top-[14vh] left-[3vw] z-20">
        <div className="font-bold text-lg">Find Your Perfect Job Match</div>
        <div className="text-xs">
          Our dashboard streamlines your job search, offering personalized job
          recommendations
        </div>
        <div className="text-xs">
          based on your skills and preferences. Start exploring tailored
          opportunities today!
        </div>
      </span>

      <span className="absolute top-0 right-0 h-[20vh] w-[20vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Rectangle 46.svg"
          alt="photo"
          layout="fill"
          objectFit="cover"
          priority
        />
      </span>

      <span className="absolute top-0 right-0 h-[10vh] w-[10vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Mask group(1).svg"
          alt="photo"
          layout="fill"
          objectFit="cover"
          priority
        />
      </span>

      <span className="absolute top-[10vh] left-[3vw] h-[10vh] w-[10vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Vector 56.svg"
          alt="photo"
          width={100}
          height={100}
          priority
        />
      </span>
      <span className="absolute top-[10vh] left-[8vw] h-[1vh] w-[1vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Ellipse 34.svg"
          alt="photo"
          width={100}
          height={100}
          priority
        />
      </span>
      <span className="absolute top-[10vh] left-[9vw] h-[1vh] w-[1vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Ellipse 34.svg"
          alt="photo"
          width={100}
          height={100}
          priority
        />
      </span>
      <span className="absolute top-[10vh] left-[10vw] h-[1vh] w-[1vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Ellipse 34.svg"
          alt="photo"
          width={100}
          height={100}
          priority
        />
      </span>

      <span className="absolute bottom-0 left-0 h-[20vh] w-[20vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Ellipse 36.svg"
          alt="photo"
          layout="fill"
          objectFit="cover"
          priority
        />
      </span>

      <span className="absolute bottom-0 left-0 h-[10vh] w-[10vh] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Mask group(2).svg"
          alt="photo"
          layout="fill"
          objectFit="cover"
          priority
        />
      </span>

      <span className="absolute top-[200px] right-[-160px] h-[650px] w-[650px] overflow-hidden rounded-bl-2xl">
        <Image
          src="/Frame 1-5 1(1).svg"
          alt="photo"
          width={500}
            height={500}
        
          priority
        />

        <span className="absolute top-[45px] left-[45px] h-[100px] w-[100px] overflow-hidden rounded-bl-2xl">
          <Image
            src="/WorkR-Logo.svg"
            alt="photo"
            width={80}
            height={80}
            objectFit="cover"
            priority
          />
        </span>
      </span>
    </div>
  );
}
