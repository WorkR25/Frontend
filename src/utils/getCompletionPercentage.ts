import { GetUserResponseType } from "@/types/GetUserResponseType";

export const getCompletionPercentage = (data: GetUserResponseType) => {
    const fullName = data.fullName ? 1 : 0 ;
    const email = data.email ? 1 : 0 ;
    const phoneNo = data.phoneNo ? 1 : 0 ;
    const currentCtc =  data.profile.isFresher? 1 : data.profile.currentCtc === '0.00' ? 0 : 1 ;
    const yearsOfExperience =  data.profile.isFresher? 1 : data.profile.yearsOfExperience ? 1 : 0 ;
    const bio = data.profile.bio ? 1 : 0 ;
    const skills = data.skills.length>0 ? 1 : 0 ;
    const locations = data.profile.currentLocationId ? 1 : 0 ;
    const linkedinUrl = data.profile.linkedinUrl ? 1 : 0 ;
    const resumeUrl = data.profile.resumeUrl ? 1 : 0 ;

    const res= fullName+ email+ phoneNo+ currentCtc+ yearsOfExperience+ bio+ skills+ locations+ linkedinUrl+ resumeUrl;
    return Math.floor(res*10);

}