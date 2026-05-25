// import LogInForm from "@/components/login/LoginForm";
// import SignUpHero from "@/components/signup/SignUpHero";
// import TripleDotLoader from "@/components/TripleDotLoader";
// import { Suspense } from "react";

// export default function Page() {
//   return (
//     <div className=" text-black bg-white font-poppins h-full w-full ">
//       <div className="flex w-screen h-full p-2 gap-x-2">
//         <div className="sm:basis-45/100 w-full sm:w-auto flex items-center justify-center rounded-2xl shadow-xs shadow-black overflow-y-scroll">
//           <Suspense
//             fallback={
//               <div>
//                 <TripleDotLoader />
//               </div>
//             }
//           >
//             <LogInForm />
//           </Suspense>
//         </div>
//         <div className="bg-[#E7F2F8] basis-55/100 hidden sm:flex items-center justify-center shadow-xs shadow-black rounded-2xl overflow-hidden">
//           <SignUpHero />
//         </div>
//       </div>
//     </div>
//   );
// }

import LogInForm from "@/components/login/LoginForm";
import SignUpHero from "@/components/signup/SignUpHero";
import TripleDotLoader from "@/components/TripleDotLoader";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className=" bg-[#F3F8FC] font-poppins text-[#1F2A37] h-full w-full">
      <div className="sm:grid grid-cols-[4fr_5fr] w-full h-[100%] p-3 gap-x-2">
        <div className=" w-full h-full min-h-0 overflow-y-  rounded-[28px] border border-[#D7E6F3] bg-[linear-gradient(180deg,#FDFEFF_0%,#F7FBFF_100%)] shadow-[0_8px_30px_rgba(104,140,171,0.12)] sm:basis-[45%]">
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
        <div className="hidden sm:flex sm:basis-[55%] overflow-hidden rounded-[28px] border border-[#D7E6F3] bg-[linear-gradient(180deg,#EEF7FD_0%,#DCEEFF_100%)] shadow-[0_8px_30px_rgba(104,140,171,0.12)]">
          <SignUpHero />
        </div>
      </div>
    </div>
  );
}
