// 'use client'
import SignupForm from "@/components/signup/SignUpForm";
import SignUpHero from "@/components/signup/SignUpHero";

export default function Page() {
  return (
    <div className="text-black bg-white font-poppins h-full w-full">
      <div className="flex w-screen h-[100%] p-2 gap-x-2">
        <div className="sm:basis-45/100 w-full sm:w-auto flex items-center justify-center rounded-2xl shadow-xs shadow-black overflow-y-scroll">
          <SignupForm/>
        </div>
        <div className="bg-[#E7F2F8] basis-55/100  sm:flex hidden items-center justify-center shadow-xs shadow-black rounded-2xl overflow-hidden">
          <SignUpHero />
        </div>
      </div>
    </div>
  );
}


