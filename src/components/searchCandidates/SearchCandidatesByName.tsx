"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { RootState } from "@/lib/store.config";
import useSearchCandidatesByName from "@/utils/useSearchCandidatesByName";
import { setShowSearchCandidatesByName } from "@/features/showSearchCandidates/showSearchCandidatesByName";

export default function SearchCandidatesByName() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const limit = 10 ;

    const nameParam = searchParams.get("name") ?? "";
    const [input, setInput] = useState(nameParam);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const jwtToken = useSelector(
        (state: RootState) => state.authJwtToken.value
    );
    const { data, isLoading } = useSearchCandidatesByName(jwtToken, nameParam, page, limit);

    useEffect(() => {
        if (data) {
            setTotalPages(data.count ? Math.ceil(data.count / limit) : 1);
        }
    }, [data]);


    // Keep input in sync with URL (ONE WAY)
    useEffect(() => {
        setInput(nameParam);
    }, [nameParam]);

    // Debounce URL updates
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        const timer = setTimeout(() => {
            if (!input.trim()) {
                params.delete("name");
            } else {
                params.set("name", input.trim());
            }

            params.delete("email"); // ensure exclusivity
            router.replace(`?${params.toString()}`, { scroll: false });
        }, 400);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);


    return (
        <div className="flex flex-col h-full w-full gap-4 min-h-0 relative">
            <div
                className="absolute top-5 right-1 cursor-pointer"
                onClick={() => dispatch(setShowSearchCandidatesByName(false))}
            >
                <X />
            </div>

            <div className="text-xl my-3 text-center">
                Search Candidates By Name
            </div>

            <input
                type="text"
                placeholder="Search by name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="rounded-full border px-5 py-2"
            />

            <div className="flex-1 min-h-0 overflow-y-auto rounded-lg space-y-2 py-2">
                {isLoading && <div className="p-4">Loading...</div>}

                {!isLoading && nameParam && data?.rows.length === 0 && (
                    <div className="p-4 text-gray-500">No results found</div>
                )}

                {data?.rows.map((user) => (
                    <div key={user.id} className="border rounded-2xl p-4">
                        <div><b>Name:</b> {user.fullName}</div>
                        <div><b>Email:</b> {user.email}</div>
                        <div><b>Phone:</b> {user.phoneNo}</div>
                        <div>
                            <b>Graduation Year:</b>{" "}
                            {user.graduationYear ?? "Not available"}
                        </div>
                    </div>
                ))}

                {!nameParam && (
                    <div className="p-4 text-gray-500">
                        Search using a name to see candidate details
                    </div>
                )}
            </div>
            <div className="w-[100%] sticky bottom-0 bg-[#F5F5F5] border-t shadow-sm">
                <div className="flex items-center justify-between px-4 py-2">
                    <button
                        className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
                        disabled={page === 1}
                        onClick={() => {
                            setPage((prev) => Math.max(prev - 1, 1));
                        }}
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Prev
                    </button>

                    <span className="text-sm font-medium text-black">
                        Page {page} of {totalPages == -1 ? "" : totalPages}
                    </span>

                    <button
                        className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
                        disabled={page === totalPages}
                        onClick={() => {
                            setPage((prev) => Math.min(prev + 1, totalPages));
                        }}
                    >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
