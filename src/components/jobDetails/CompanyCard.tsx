import { CompanyCardProps } from "@/types/CompanyCardProps";
import Image from "next/image";
import MarkdownHTML from "./MarkdownRender";

export default function CompanyCard({
  logoUrl,
  name,
  location,
  industry,
  size,
  description,
}: CompanyCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 mt-3 p-5 bg-white space-y-4 shadow-sm">
      <h3 className="text-md font-semibold text-gray-900">About Company</h3>

      <div className="flex items-center gap-4">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-md"
          />
        )}

        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>
      </div>

      <div className="gap-3 flex flex-wrap">
        <span className="px-3 py-1 text-xs bg-gray-100 rounded-lg text-gray-700">
          {industry}
        </span>
        <span className="px-3 py-1 text-xs bg-gray-100 rounded-lg text-gray-700">
          {size}
        </span>
      </div>

      <div className="text-sm text-gray-600 leading-relaxed">
        <MarkdownHTML content={description ?? "null"}/>
      </div>
    </div>
  );
}
