import { cn } from "@/utils/cn";

export default function JobInfoCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 flex flex-col text-center items-center justify-center  bg-white h-[10vh] sm:h-[15vh]",
        className
      )}
    >
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-base font-semibold text-black">{value}</div>
    </div>
  );
}