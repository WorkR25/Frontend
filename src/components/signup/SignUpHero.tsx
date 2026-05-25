// import Image from "next/image";

// export default function SignUpHero() {
//   return (
//     <div className="h-full w-full relative font-poppins">
//       <span className="absolute top-[14vh] left-[3vw] z-20">
//         <div className="font-bold text-lg">Find Your Perfect Job Match</div>
//         <div className="text-xs">
//           Our dashboard streamlines your job search, offering personalized job
//           recommendations
//         </div>
//         <div className="text-xs">
//           based on your skills and preferences. Start exploring tailored
//           opportunities today!
//         </div>
//       </span>

//       <span className="absolute top-0 right-0 h-[20vh] w-[20vh] overflow-hidden rounded-bl-2xl">
//         <Image
//           src="/Rectangle 46.svg"
//           alt="photo"
//           layout="fill"
//           objectFit="cover"
//           priority
//         />
//       </span>

//       <span className="absolute top-0 right-0 h-[10vh] w-[10vh] overflow-hidden rounded-bl-2xl">
//         <Image
//           src="/Mask group(1).svg"
//           alt="photo"
//           layout="fill"
//           objectFit="cover"
//           priority
//         />
//       </span>

//       <div className="absolute top-[10vh] left-[3vw] w-[10vh] flex gap-2">
//         <Image
//           src="/Vector 56.svg"
//           alt="photo"
//           width={100}
//           height={100}
//           priority
//         />
//         <Image
//           src="/Ellipse 34.svg"
//           alt="photo"
//           width={10}
//           height={10}
//           priority
//         />
//         <Image
//           src="/Ellipse 34.svg"
//           alt="photo"
//           width={10}
//           height={10}
//           priority
//         /><Image
//           src="/Ellipse 34.svg"
//           alt="photo"
//           width={10}
//           height={10}
//           priority
//         />
//       </div>

//       <span className="absolute bottom-0 left-0 h-[20vh] w-[20vh] overflow-hidden rounded-bl-2xl">
//         <Image
//           src="/Ellipse 36.svg"
//           alt="photo"
//           layout="fill"
//           objectFit="cover"
//           priority
//         />
//       </span>

//       <span className="absolute bottom-0 left-0 h-[10vh] w-[10vh] overflow-hidden rounded-bl-2xl">
//         <Image
//           src="/Mask group(2).svg"
//           alt="photo"
//           layout="fill"
//           objectFit="cover"
//           priority
//         />
//       </span>

//       <span className=" absolute bottom-[-200px] right-auto left-[100px] lg:left-auto lg:right-[-90px] h-[650px] w-[650px] overflow-hidden rounded-bl-2xl">
//         <Image
//           src="/Frame 3(1).png"
//           alt="photo"
//           width={600}
//           height={600}
//           priority
//         />
//       </span>
//     </div>
//   );
// }
"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function SignUpHero() {
  const buffer = 20;
  const textAreaRef = useRef<HTMLDivElement | null>(null);
  // const imageDivRef = useRef<HTMLDivElement | null>(null);
  const parentDivRef = useRef<HTMLDivElement | null>(null);
  const [cords, setCords] = useState({ bottom: 0, left: 0 });

  useEffect(() => {
    const updateBottom = () => {
      if (parentDivRef.current && textAreaRef.current) {
        const parentDivHeight = parentDivRef.current.clientHeight;
        const imgDivHeight = parentDivRef.current.clientWidth * 0.8;
        const textAreaBottom =
          textAreaRef.current.getBoundingClientRect().bottom;
        if (imgDivHeight + textAreaBottom > parentDivHeight + buffer) {
          setCords({ bottom: Math.floor(textAreaBottom), left: 0 });
        } else {
          setCords({
            bottom: Math.floor(parentDivHeight - imgDivHeight + buffer),
            left: 0,
          });
        }
      }
    };

    updateBottom();

    window.addEventListener("resize", updateBottom);

    return () => {
      window.removeEventListener("resize", updateBottom);
    };
  }, []);

  return (
    <div
      ref={parentDivRef}
      className="relative h-full w-full overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#EEF7FD_0%,#DCEEFF_100%)] font-poppins"
    >
      {/* soft main glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.82)_22%,rgba(255,255,255,0.30)_48%,rgba(255,255,255,0)_72%)]" />

      {/* top-right decorative block */}
      <div className="absolute right-0 top-0 h-[210px] w-[210px] rounded-bl-[34px] bg-[#D4E9FA]" />
      <div className="absolute right-8 top-6 h-[72px] w-[72px] rounded-[22px] border-[6px] border-[#B7D7F0]/90 bg-transparent" />

      {/* bottom-left decorative shapes */}
      <div className="absolute bottom-[-80px] left-[-60px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(183,215,240,0.52)_0%,rgba(183,215,240,0.34)_38%,rgba(183,215,240,0.10)_60%,rgba(183,215,240,0)_78%)]" />
      <div className="absolute bottom-0 left-0 h-[150px] w-[245px] rounded-tr-[34px] bg-white/30" />
      <div className="absolute bottom-[56px] left-[36px] h-[86px] w-[116px] rounded-[22px] bg-white/30" />
      <div className="absolute bottom-[26px] left-[92px] h-[34px] w-[34px] rounded-[8px] border-[4px] border-[#D7EAF8] bg-[#EEF7FD]" />

      {/* curved wave */}
      <div className="absolute bottom-0 left-0 h-[210px] w-full bg-[radial-gradient(120%_120%_at_20%_0%,rgba(255,255,255,0)_44%,rgba(178,214,244,0.55)_60%,rgba(164,206,241,0.70)_74%,rgba(152,198,236,0.84)_100%)]" />
      <div className="absolute bottom-[26px] left-[54%] h-3 w-3 rounded-full bg-white/80" />
      <div className="absolute bottom-[18px] left-[58%] h-2 w-2 rounded-full bg-white/65" />
      <div className="absolute bottom-[46px] left-[61%] h-1.5 w-1.5 rounded-full bg-white/65" />

      {/* heading section */}
      <div ref={textAreaRef} className="absolute left-[52px] top-[68px] z-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-[7px] w-[112px] rounded-full bg-[#1681D8]" />
          <div className="h-[9px] w-[9px] rounded-full bg-[#A7C8E8]" />
          <div className="h-[9px] w-[9px] rounded-full bg-[#A7C8E8]" />
          <div className="h-[9px] w-[9px] rounded-full bg-[#A7C8E8]" />
        </div>

        <h2 className="max-w-[540px] text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#17315B]">
          Find Your Perfect Job Match
        </h2>

        <p className="mt-5 max-w-8/10 text-[18px] leading-[1.4] text-[#334E73]">
          Our dashboard streamlines your job search, offering personalized job
          recommendations based on your skills and preferences.
          <br />
          Start exploring tailored opportunities today!
        </p>
      </div>

      {/* dashboard image */}
      {cords.bottom && (
        <div
          style={{ top: cords.bottom + buffer }}
          className={`absolute right-[-10px] z-20 w-8/10 `}
        >
          <div className="rounded-tl-[28px] border border-white/70 bg-white/55 shadow-[0_30px_80px_rgba(70,112,151,0.18)] backdrop-blur-sm">
            <Image
              src="/Frame 3(1).png"
              alt="WorkR dashboard preview"
              width={980}
              height={760}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
