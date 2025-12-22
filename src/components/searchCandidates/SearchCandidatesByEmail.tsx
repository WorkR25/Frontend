"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import useSearchCandidatesByEmail from "@/utils/useSearchCandidatesByEmail";
import { RootState } from "@/lib/store.config";
import { setShowSearchCandidatesByEmail } from "@/features/showSearchCandidates/showSearchCandidatesByEmail";

export default function SearchCandidatesByEmail() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const emailParam = searchParams.get("email") ?? "";
    const [input, setInput] = useState(emailParam);

    const jwtToken = useSelector(
        (state: RootState) => state.authJwtToken.value
    );

    // keep input in sync with URL
    useEffect(() => {
        setInput(emailParam);
    }, [emailParam]);

    const { data, isFetching } = useSearchCandidatesByEmail(
        jwtToken,
        emailParam
    );

    function handleSearch() {
        const params = new URLSearchParams(searchParams.toString());

        // email search should be exclusive
        params.delete("name");

        if (!input.trim()) {
            params.delete("email");
        } else {
            params.set("email", input.trim());
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="flex flex-col h-full w-full gap-4 min-h-0 relative">
            <div
                className="absolute top-5 right-1 cursor-pointer"
                onClick={() => dispatch(setShowSearchCandidatesByEmail(false))}
            >
                <X />
            </div>

            <div className="text-xl my-3 text-center">
                Search Candidates By Email
            </div>

            {/* Search box */}
            <div className="flex gap-2 rounded-full border pl-2">
                <input
                    type="email"
                    placeholder="Search by email"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2 outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Search />
                </button>
            </div>

            {/* Results */}
            <div className="flex-1 min-h-0 overflow-y-auto rounded-lg">
                {isFetching && <div className="p-4">Searching...</div>}

                {!isFetching && emailParam && !data && (
                    <div className="p-4 text-gray-500">No candidate found</div>
                )}

                {data ? (
                    <div className="p-4">
                        <div className="border rounded-lg p-4">
                            <div><b>Name:</b> {data.fullName}</div>
                            <div><b>Email:</b> {data.email}</div>
                            <div><b>Phone:</b> {data.phoneNo}</div>
                            <div>
                                <b>Graduation Year:</b>{" "}
                                {data.graduationYear ?? "Not available"}
                            </div>
                        </div>
                    </div>
                ) : (
                    !emailParam && (
                        <div className="p-4 text-gray-500">
                            Search using a valid email to see candidate details
                        </div>
                    )
                )}
            </div>
            
        </div>
    );
}
