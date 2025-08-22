import UserDetailForm from "@/components/me/UserDetailForm";
import UserProfileForm from "@/components/me/UserProfileForm";
import UserSkillForm from "@/components/me/UserSkillForm";


export default function Page(){
    return (
        <div className="absolute top-0 p-6 overflow-y-scroll h-[100vh]">
            <UserDetailForm />
            <UserProfileForm />
            {/* <EditSkills /> */}
            <UserSkillForm />
        </div>
    )
}