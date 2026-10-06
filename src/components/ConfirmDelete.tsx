"use client";

import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  pending?: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  pending = false,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, pending]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,23,42,0.48)] p-4 font-plus-jakarta"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !pending) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="w-full max-w-[440px] rounded-3xl bg-white p-6 text-[#0F172A] shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FEE4E2] text-[#D92D20]">
          <Trash2 className="h-[22px] w-[22px]" aria-hidden="true" />
        </span>
        <h2 id="confirm-delete-title" className="mt-4 text-xl font-extrabold tracking-[-0.02em]">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-[#475066]">{message}</div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={pending}
            className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA] disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#D92D20] px-[22px] text-sm font-bold text-white hover:bg-[#B42318] disabled:cursor-wait disabled:opacity-80"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {pending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
