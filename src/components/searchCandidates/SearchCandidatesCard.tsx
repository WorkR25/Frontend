"use client";

import { RootState } from "@/lib/store.config";
import useSearchCandidatesByEmail from "@/utils/useSearchCandidatesByEmail";
import useSearchCandidatesByName from "@/utils/useSearchCandidatesByName";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, X } from "lucide-react";
import { setShowSearchCandidates } from "@/features/showSearchCandidates/showSearchCandidates";
// import { set } from "zod";

export default function SearchCandidatesCard() {

    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [submitEmailSearch, setSubmitEmailSearch] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");
    const [isSearch, setIsSearch] = useState(false);

        const jwtToken = useSelector((state: RootState) => {
            return state.authJwtToken.value;
        });

    const { data: candidatesByName, isPending: isPendingByName } = useSearchCandidatesByName(jwtToken, debouncedValue, 1, 10);
    const { data: candidatesByEmail, isPending: isPendingByEmail, refetch } = useSearchCandidatesByEmail(jwtToken, submitEmailSearch);

    useEffect(() => {
        if (name.trim().length === 0) return;

        const timer = setTimeout(() => {
            setDebouncedValue(name);
            updateQueryParamsName({ name });
        }, 400);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    useEffect(() => {
        if (isSearch) {
            updateQueryParamsEmail({ email: submitEmailSearch });
            refetch();
            setIsSearch(false);
        }
        // setSubmitEmailSearch("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitEmailSearch, isSearch])

    useEffect(() => {
        setName(searchParams.get("name") ?? "");
        setEmailInput(searchParams.get("email") ?? "");

        if (searchParams.get("name")) {
            setDebouncedValue(searchParams.get("name") ?? "");
        }
        if (searchParams.get("email")) {
            setSubmitEmailSearch(searchParams.get("email") ?? "");
            setIsSearch(true);
        }

    }, [searchParams, refetch]);

    function updateQueryParamsName({ name }: { name: string }) {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("email")) {
            params.delete("email");
            setEmailInput("");
        }


        if (name.trim()) {
            params.set("name", name.trim());
        } else {
            params.delete("name");
        }

        router.push(`?${params.toString()}`, { scroll: false });
    }

    function updateQueryParamsEmail({ email }: { email: string }) {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("name")) {
            params.delete("name");
            setName("");
        }

        if (email.trim()) {
            params.set("email", email.trim());
        } else {
            params.delete("email");
        }

        router.push(`?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="space-y-4 relative py-5 flex flex-col items-center w-full h-full">
            <div className="absolute top-5 right-1" onClick={() => { dispatch(setShowSearchCandidates(false)); }}>
                <X />
            </div>
            <h2 className="font-semibold">Search Candidates</h2>

            <div className="grid md:grid-cols-2 gap-2 w-full ">
                {/* Name (live update) */}
                <input
                    type="text"
                    placeholder="Search by name"
                    value={name}
                    onChange={(e) => {
                        const value = e.target.value;
                        setName(value);
                        // updateQueryParams({ name: value });
                    }}
                    className="w-full rounded-full border px-5 py-2"
                />

                {/* Email + Search button */}
                <div className="flex gap-2 rounded-full border">
                    <input
                        type="email"
                        placeholder="Search by email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 rounded-full px-5 py-2"
                    />

                    <button
                        onClick={() => {
                            setSubmitEmailSearch(emailInput);
                            setIsSearch(true);
                            // updateQueryParamsEmail({ email: submitEmailSearch });
                            // refetch();
                        }}
                        className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 hover:cursor-pointer"
                    >
                        <Search />
                    </button>
                </div>
            </div>
                {
                    ((name.length == 0) && (emailInput.length == 0)) ? (
                        <div>
                            Search using email or name only
                        </div>
                    ) :
                        (isPendingByName && isPendingByEmail) ? (
                            <div>Loading...</div>
                        ) : (
                            <div className="w-full flex-1 min-h-0 max-h-full overflow-y-scroll">
                                {name.length > 0 && candidatesByName && candidatesByName?.rows.length > 0 ? (
                                    <div>
                                        {candidatesByName.rows.map((user) => (
                                            <div key={user.id} className="border rounded-lg p-4 m-4">
                                                <div>Name: {user.fullName}</div>
                                                <div>Email: {user.email}</div>
                                                <div>Phone: {user.phoneNo}</div>
                                                <div>{"Graduation Year: "}{user.graduationYear ?? "Not available"}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : emailInput.length > 0 && candidatesByEmail ? (
                                    <div>
                                        <div key={candidatesByEmail.id} className="border rounded-lg p-4 m-4">
                                            <div>Name: {candidatesByEmail.fullName}</div>
                                            <div>Email: {candidatesByEmail.email}</div>
                                            <div>Phone: {candidatesByEmail.phoneNo}</div>
                                            <div>{"Graduation Year: "}{candidatesByEmail.graduationYear ?? "Not available"}</div>
                                        </div>

                                    </div>
                                ) : (
                                    <div>No candidates found.</div>)}
                            </div>

                        )
                }
        </div>
    );
}
