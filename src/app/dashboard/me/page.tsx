import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import UserDetailForm from "@/components/me/UserDetailForm";
import UserProfileForm from "@/components/me/UserProfileForm";
import UserSkillForm from "@/components/me/UserSkillForm";


export default function Page(){
    return (
        <div className="me-page absolute top-0 p-6 pt-2 overflow-y-scroll h-[100%]">
            <DashboardTopbar pageName="About You" />
            <UserDetailForm />
            <UserProfileForm />
            {/* <EditSkills /> */}
            <UserSkillForm />
        </div>
    )
}