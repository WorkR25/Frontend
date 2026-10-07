"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { TextInput } from "@/components/me/profileUi";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { invalid?: boolean };

/** Password field with a lock icon and a show/hide toggle. */
const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <TextInput
        ref={ref}
        type={visible ? "text" : "password"}
        icon={<Lock className="h-[18px] w-[18px]" aria-hidden="true" />}
        className="pr-12"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#5B6478] hover:bg-[#F4F6FA] hover:text-[#0F172A]"
      >
        {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
});

export default PasswordInput;

/** Live checklist for the signup password rules. */
export function PasswordRules({ value }: { value: string }) {
  const rules = [
    { label: "8+ characters", ok: value.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(value) },
    { label: "Lowercase", ok: /[a-z]/.test(value) },
    { label: "Number", ok: /\d/.test(value) },
    { label: "Special (@$!%*#?&^_-)", ok: /[@$!%*#?&^_-]/.test(value) },
  ];
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Password requirements">
      {rules.map((r) => (
        <li
          key={r.label}
          className={
            r.ok
              ? "rounded-full bg-[#E3F6EC] px-2.5 py-1 text-xs font-semibold text-[#11643C]"
              : "rounded-full bg-[#F1F4F9] px-2.5 py-1 text-xs font-semibold text-[#5B6478]"
          }
        >
          {r.ok ? "✓ " : ""}
          {r.label}
          <span className="sr-only">{r.ok ? " (met)" : " (not met)"}</span>
        </li>
      ))}
    </ul>
  );
}
