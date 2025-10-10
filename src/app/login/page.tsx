import LogInForm from "@/components/login/LoginForm";
import SignUpHero from "@/components/signup/SignUpHero";
import TripleDotLoader from "@/components/TripleDotLoader";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

export default function Page() {
  return (
    <div className=" text-black bg-white font-poppins h-full w-full ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex w-screen h-full p-2 gap-x-2">
        <div className="sm:basis-45/100 w-full sm:w-auto flex items-center justify-center rounded-2xl shadow-xs shadow-black overflow-y-scroll">
          <Suspense
            fallback={
              <div>
                <TripleDotLoader />
              </div>
            }
          >
            <LogInForm />
          </Suspense>
        </div>
        <div className="bg-[#E7F2F8] basis-55/100 hidden sm:flex items-center justify-center shadow-xs shadow-black rounded-2xl overflow-hidden">
          <SignUpHero />
        </div>
      </div>
    </div>
  );
}
