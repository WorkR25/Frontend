"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { openLoginRequired } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useCreateApplication from "@/utils/useCreateApplication";
import useGetUser from "@/utils/useGetUser";

/** Apply / referral / share actions shared by the job hero and the closing CTA. */
export default function useJobActions(
  jobId: number,
  applyLink: string,
  job?: { title?: string; companyName?: string; companyLogo?: string | null },
) {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  useEffect(() => {
    if (!jwtToken) {
      const jwt = localStorage.getItem("AuthJwtToken");
      if (jwt) dispatch(setAuthJwtToken(jwt));
    }
  }, [dispatch, jwtToken]);

  const { mutate } = useCreateApplication();
  const { isSuccess: isLoggedIn } = useGetUser(jwtToken);

  const apply = () => {
    if (!isLoggedIn) {
      dispatch(openLoginRequired({ reason: "apply", jobTitle: job?.title, companyName: job?.companyName, companyLogo: job?.companyLogo }));
      return;
    }
    mutate({ jobId, jwtToken });
    if (applyLink) {
      window.open(applyLink, "_blank", "noopener,noreferrer");
    } else {
      toast.warning("Invalid apply link");
    }
  };

  const requestReferral = () => {
    if (!isLoggedIn) {
      dispatch(openLoginRequired({ reason: "referral", jobTitle: job?.title, companyName: job?.companyName, companyLogo: job?.companyLogo }));
      return;
    }
    toast.success("Request is submitted successfully");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Job link copied");
    } catch {
      // Share sheet dismissed — nothing to do.
    }
  };

  const save = () => {
    toast.info("Saving jobs is coming soon");
  };

  return { apply, requestReferral, share, save };
}
