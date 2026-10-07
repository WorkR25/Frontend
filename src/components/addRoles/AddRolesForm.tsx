"use client";

import { AlertCircle, Check, Info, Loader2, Search, ShieldCheck, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setShowAddRolesForm } from "@/features/showAddRolesForm/showAddRolesFormSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/utils/cn";
import useCreateRole from "@/utils/useCreateRole";
import { useDebounce } from "@/utils/useDebounce";
import useGetRoles from "@/utils/useGetRoles";

/** Role names are stored like the existing ones: lowercase, words joined by "_" (e.g. operations_admin). */
function toRoleKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function prettyRole(name: string) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AddRoles() {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const roleKey = toRoleKey(input);
  const debouncedKey = useDebounce(roleKey, 350);

  const { data: matches, isFetching, refetch } = useGetRoles(jwtToken, debouncedKey);
  const { mutate, isPending } = useCreateRole();

  const close = useCallback(() => dispatch(setShowAddRolesForm(false)), [dispatch]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, isPending]);

  const checking = roleKey !== debouncedKey || isFetching;
  const results = useMemo(() => (debouncedKey ? matches ?? [] : []), [matches, debouncedKey]);
  const exact = results.some((r) => r.name.toLowerCase() === roleKey);
  const tooShort = roleKey.length > 0 && roleKey.length < 3;
  const canSubmit = !!roleKey && !tooShort && !exact && !checking && !isPending;

  const footerNote = !roleKey
    ? "Type a role name to continue"
    : tooShort
      ? "Use at least 3 characters"
      : checking
        ? "Checking existing roles…"
        : exact
          ? "This role already exists"
          : "Creates a new role";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const name = roleKey;
    mutate(
      { authJwtToken: jwtToken, roleName: name },
      {
        onSuccess: () => {
          setAdded((list) => [name, ...list.filter((r) => r !== name)].slice(0, 6));
          setInput("");
          refetch();
          inputRef.current?.focus();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(15,23,42,0.48)] p-4 font-plus-jakarta"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-role-title"
        className="my-auto w-full max-w-[560px] rounded-3xl bg-white text-[#0F172A] shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-start gap-4 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF4E0] text-[#8A4B00]">
            <ShieldCheck className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="add-role-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
              Add a role
            </h2>
            <p className="mt-1 text-sm leading-normal text-[#5B6478]">
              Roles control what a person can see and do in the dashboard.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            disabled={isPending}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[#5B6478] hover:bg-[#F1F4F9] disabled:cursor-not-allowed"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="mx-5 mb-5 flex gap-2.5 rounded-xl bg-[#F4F6FA] px-3.5 py-3 text-[13px] leading-normal text-[#475066] sm:mx-7">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2451D6]" strokeWidth={2.2} aria-hidden="true" />
          <span>
            Names are saved in lowercase with underscores, like{" "}
            <code className="rounded bg-white px-1 py-0.5 text-[12px] font-semibold text-[#0F172A]">operations_admin</code>.
            A new role has no access until the app is set up to use it.
          </span>
        </div>

        {added.length > 0 && (
          <div
            role="status"
            className="mx-5 mb-5 flex items-center gap-2.5 rounded-xl border border-[#BFE8D2] bg-[#E3F6EC] px-3.5 py-3 text-sm font-semibold text-[#11643C] sm:mx-7"
          >
            <Check className="h-[18px] w-[18px] shrink-0" strokeWidth={2.6} aria-hidden="true" />
            “{added[0]}” added. You can add another one.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="px-5 sm:px-7">
            <label htmlFor="role-name" className="mb-2 block text-sm font-bold">
              Role name
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#2451D6]"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id="role-name"
                type="text"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. content manager"
                aria-invalid={exact || tooShort || undefined}
                aria-describedby="role-preview"
                maxLength={50}
                className={cn(
                  "h-[52px] w-full rounded-[14px] border-[1.5px] bg-white pl-11 pr-11 text-[15px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#98A2B3] focus:ring-4",
                  exact
                    ? "border-[#F5C77A] focus:border-[#E0A43A] focus:ring-[#FFF4E0]"
                    : "border-[#E4E8F0] focus:border-[#2451D6] focus:ring-[#2451D6]/10",
                )}
              />
              {checking && roleKey && (
                <Loader2
                  className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#8A93A6]"
                  aria-hidden="true"
                />
              )}
            </div>

            <div id="role-preview" className="mt-2 min-h-[20px] text-xs">
              {exact ? (
                <span className="flex items-center gap-1.5 font-medium text-[#8A4B00]">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />“{roleKey}” already exists. No need to
                  add it again.
                </span>
              ) : roleKey && roleKey !== input.trim() ? (
                <span className="text-[#5B6478]">
                  Will be saved as{" "}
                  <code className="rounded bg-[#F1F4F9] px-1.5 py-0.5 font-semibold text-[#0F172A]">{roleKey}</code>
                </span>
              ) : null}
            </div>

            {roleKey && !checking && (
              <div className="mt-3">
                <div className="mb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478]">
                  {results.length > 0 ? "EXISTING ROLES THAT MATCH" : "NO MATCHING ROLES"}
                </div>
                {results.length > 0 ? (
                  <ul className="max-h-48 divide-y divide-[#EEF1F6] overflow-y-auto rounded-2xl border border-[#E4E8F0]">
                    {results.map((role) => {
                      const same = role.name.toLowerCase() === roleKey;
                      return (
                        <li
                          key={role.id}
                          className={cn("flex items-center gap-3 px-4 py-2.5", same && "bg-[#FFF8EC]")}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F4F9] text-[#5B6478]">
                            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{prettyRole(role.name)}</span>
                            <span className="block truncate text-xs text-[#8A93A6]">{role.name}</span>
                          </span>
                          {same && (
                            <span className="rounded-full bg-[#FFF4E0] px-2.5 py-1 text-[11px] font-bold text-[#8A4B00]">
                              Exact match
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="rounded-2xl border border-dashed border-[#D5DBE6] bg-[#FAFBFD] px-4 py-3 text-sm text-[#5B6478]">
                    “{roleKey}” is new. Press <strong className="text-[#0F172A]">Add role</strong> to create it.
                  </p>
                )}
              </div>
            )}
          </div>

          {added.length > 0 && (
            <div className="mx-5 mt-5 sm:mx-7">
              <div className="mb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478]">ADDED JUST NOW</div>
              <div className="flex flex-wrap gap-2">
                {added.map((r) => (
                  <span
                    key={r}
                    className="flex items-center gap-1.5 rounded-full border border-[#E4E8F0] bg-[#F4F6FA] px-3 py-1.5 text-[13px] font-semibold"
                  >
                    <Check className="h-3 w-3 text-[#11643C]" strokeWidth={3} aria-hidden="true" />
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1F6] px-5 py-[18px] sm:px-7">
            <span className="text-[13px] text-[#5B6478]" aria-live="polite">
              {footerNote}
            </span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={close}
                disabled={isPending}
                className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA] disabled:cursor-not-allowed"
              >
                {added.length > 0 ? "Done" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isPending ? "Adding…" : "Add role"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
