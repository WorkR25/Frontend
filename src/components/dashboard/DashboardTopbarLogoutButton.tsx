"use client";

import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useGetUser from "@/utils/useGetUser";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardTopbarLogoutButton() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const { isSuccess } = useGetUser(jwtToken);

  useEffect(() => {
    setMounted(true);
  }, [isSuccess]);

  if (!mounted) return null;

  return (
    <div>
      {isSuccess && (
        <button
          type="button"
          aria-label="Log out"
          title="Log out"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#E4E8F0] bg-white text-[#344054] transition-colors hover:bg-[#EEF2FA]"
          onClick={() => {
            localStorage.removeItem("AuthJwtToken");
            dispatch(setAuthJwtToken(""));
            router.replace("/login");
          }}
        >
          <LogOut height={18} width={18} />
        </button>
      )}
    </div>
  );
}
