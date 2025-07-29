import { ArrowUpRight } from "lucide-react";

export default function TipsCard() {
  return (
    <div className="bg-[#007ac2] text-white rounded-2xl p-6 relative w-full shadow-md">

      <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
        <ArrowUpRight size={18} strokeWidth={2.5} />
      </button>

      <div className="text-xl font-semibold leading-tight">
        We’ve got some tips<br />
        <span className="font-bold">only for you!🌟</span>
      </div>

      <p className="text-sm text-white/70 mt-2">
        Check our latest information for tips and trick!
      </p>
    </div>
  );
}
