import { Suspense } from "react";
import SignupForm from "@/components/signup/SignUpForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-[#F4F6FA]" />}>
      <SignupForm />
    </Suspense>
  );
}
