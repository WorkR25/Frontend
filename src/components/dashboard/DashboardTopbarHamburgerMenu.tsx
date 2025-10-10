'use client' ;
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { AlignJustify } from "lucide-react";
import { useDispatch } from "react-redux";

export default function DashboardTopbarHamburgerMenu(){
    const dispatch = useDispatch();
    return (
        <div
          className="components-dashboard-DashboardTopbar sm:hidden hover:cursor-pointer"
          onClick={() => {
            dispatch(isSidebarOpenToogle(true));
          }}
        >
          <AlignJustify />
        </div>
    )
}