import { Suspense } from "react";
import LogInForm from "@/components/login/LoginForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-[#F4F6FA]" />}>
      <LogInForm />
    </Suspense>
  );
}
