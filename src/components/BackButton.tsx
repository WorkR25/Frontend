'use client';
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton(){
    const router = useRouter();
    return (
        <div className="text-center p-2 pb-0 sm:pb-2 mb-2 hover:cursor-pointer" onClick={() => router.back()}>
            <ChevronLeft/>
        </div>
    )
}
