import { cn } from "@/utils/cn";

export default function TripleDotLoader({className= "fixed"}: {className?: string}){
    return (
        <div className={cn(' inset-0 z-50 flex items-center justify-center bg-white/50', className)}>
          <div className="loader"></div>
        </div>
    )
}