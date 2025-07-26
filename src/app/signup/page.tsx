// 'use client'
import SignupForm from "@/components/signup/SignUpForm";
import SignUpHero from "@/components/signup/SignUpHero";

export default function Page() {
  return (
    <div className="text-black bg-white font-poppins ">
      <div className="flex w-screen h-screen p-2 gap-x-2">
        <div className="sm:basis-40/100 w-full sm:w-auto flex items-center justify-center border rounded-2xl shadow-sm shadow-black overflow-y-scroll">
          <SignupForm/>
        </div>
        <div className="bg-[#E7F2F8] basis-60/100  sm:flex hidden items-center justify-center  rounded-2xl overflow-hidden">
          <SignUpHero />
        </div>
      </div>
    </div>
  );
}


