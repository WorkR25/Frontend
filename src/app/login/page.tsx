import LogInForm from "@/components/login/LoginForm";
import SignUpHero from "@/components/signup/SignUpHero";

export default function Page() {
  return (
    <div className=" text-black bg-white font-poppins h-full w-full ">
      <div className="flex w-screen h-full p-2 gap-x-2">
        <div className="sm:basis-45/100 w-full sm:w-auto flex items-center justify-center rounded-2xl shadow-xs shadow-black overflow-y-scroll">
          <LogInForm />
        </div>
        <div className="bg-[#E7F2F8] basis-55/100 hidden sm:flex items-center justify-center shadow-xs shadow-black rounded-2xl overflow-hidden">
          <SignUpHero />
        </div>
      </div>
    </div>
  );
}
