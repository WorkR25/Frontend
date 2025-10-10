"use client";

import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { RootState } from "@/lib/store.config";
import useGetUser from "@/utils/useGetUser";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardTopbarLogoutButton() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const { isSuccess } = useGetUser(jwtToken);

  useEffect(() => {
    setMounted(true);
  }, [isSuccess]);

  if (!mounted) return null;

  return (
    <div>
      {isSuccess && (
        <button
          className="rounded-full bg-blue-200 hover:cursor-pointer hover:bg-blue-300 p-2"
          onClick={() => {
            localStorage.removeItem("AuthJwtToken");
            dispatch(setAuthJwtToken(""));
            router.replace("/login");
          }}
        >
          <LogOut height={16} width={16} />
        </button>
      )}
    </div>
  );
}
