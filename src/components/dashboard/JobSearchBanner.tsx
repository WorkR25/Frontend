import { MapPin, Search } from "lucide-react";

export default function JobSearchBanner() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 p-3 sm:p-8 text-white ">
      <h2 className="text-xl sm:text-2xl font-semibold">
        Explore Your Career Opportunities Here
      </h2>
      <p className="text-sm sm:text-base mt-2 mb-3 sm:mb-6 text-white/80">
        Apply to jobs that match your skills and aspirations, and embark on a
        rewarding career journey.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-lg overflow-hidden shadow-md px-2 py-1 gap-2 sm:gap-0">
        <div className="flex items-center flex-1 px-3">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your job title or keyword..."
            className="w-full outline-none px-2 py-2 text-sm text-gray-800"
          />
        </div>

        <div className="flex items-center flex-1 px-3 border-t sm:border-t-0 sm:border-l border-gray-200">
          <MapPin className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Set your country or timezone..."
            className="w-full outline-none px-2 py-2 text-sm text-gray-800"
          />
        </div>

        <button className="bg-blue-600 hidden sm:inline hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg whitespace-nowrap">
          Find Job
        </button>
      </div>
      <button className="sm:hidden w-full mt-2 bg-white text-blue-700 text-sm px-6 py-2 rounded-lg whitespace-nowrap">
        Find Job
      </button>
    </div>
  );
}