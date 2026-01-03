'use client';

import { setShowAddRolesForm } from "@/features/showAddRolesForm/showAddRolesFormSlice";
import { RootState } from "@/lib/store.config";
import useCreateRole from "@/utils/useCreateRole";
import useGetRoles from "@/utils/useGetRoles";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddRoles() {
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const [debouncedInput, setDebouncedInput] = useState("");
    const authJwtToken = useSelector((state: RootState) => state.authJwtToken.value);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedInput(input);
        }, 500);
        return () => clearTimeout(timeout);
    }, [input])

    // const roleNames = ["admin", "recruiter", "user"]
    const { mutate, isSuccess } = useCreateRole();
    const { data: roleNames, refetch, isLoading, } = useGetRoles(authJwtToken, debouncedInput);
    // console.log(roleNames)
    if (isSuccess) {
        refetch();
    }
    const isDisabled = isLoading || (roleNames ? roleNames?.length > 0 : false) || debouncedInput.trim() === "";

    return (
        <div className="px-8 py-3 relative">
            <button className="absolute top-4 right-1 hover:cursor-pointer" onClick={() => { dispatch(setShowAddRolesForm(false)) }}>
                <X />
            </button>
            <div className="text-center text-2xl font-semibold">
                Add Roles
            </div>
            <div className="my-3 ">
                <div className="flex rounded-t-2xl w-full border overflow-hidden ">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full px-5 py-2"
                    />
                    <button 
                    disabled={isDisabled}
                    className={`bg-blue-500 px-6 ${isDisabled ? " hover:cursor-not-allowed " : " hover:cursor-pointer "} `} onClick={() => { mutate({ authJwtToken: authJwtToken, roleName: debouncedInput }) }}>
                        Create
                    </button>
                </div>
                {
                    roleNames ? (
                        roleNames.length === 0 ? (
                            <div>No roles found</div>
                        ) : (
                            <div className="divide divide-y border rounded-b-2xl mt-px">
                                {roleNames.map((role, idx) => (
                                    <div key={idx} className="w-full px-5 py-2">
                                        {role.name}
                                    </div>
                                ))}
                            </div>
                        )
                    ) : null
                }

            </div>
        </div>
    )
}