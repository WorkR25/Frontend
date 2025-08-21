import { ArrowUpDown } from "lucide-react";

export default function SortButton() {
  return (
    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-100 transition">
      <ArrowUpDown className="w-4 h-4 " />
      <span className="hidden sm:inline ">Sort By</span>
    </button>
  );
}
