import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function Page(){
    return (
        <div className="text-black p-2 bg-[#FFFF] h-full pb-0 ">
            <DashboardTopbar pageName="Details" />
            <div>Details page </div>
        </div>
    )
}