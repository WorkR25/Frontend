import { GetUserResponseType } from "@/types/GetUserResponseType";

export const getCompletionPercentage = (data: GetUserResponseType) => {
    const fullName = data.fullName ? 1 : 0 ;
    const email = data.email ? 1 : 0 ;
    const phoneNo = data.phoneNo ? 1 : 0 ;
    const details = data.profile.details ? 1 : 0 ;
    const graduationYear = data.graduationYear ? 1 : 0 ;
    const currentCompany = ( data.profile.details == "Freshers" ) ? 1: data.profile.currentCompany ? 1 : 0;
    const currentCtc =  ( data.profile.details == "Freshers" ) ? 1 : data.profile.currentCtc == null ? 0 : 1 ;
    const yearsOfExperience =  ( data.profile.details == "Freshers" ) ? 1 : data.profile.yearsOfExperience ? 1 : 0 ;
    const bio = data.profile.bio ? 1 : 0 ;
    const skills = data.skills.length>0 ? 1 : 0 ;
    // const locations = data.profile.currentLocationId ? 1 : 0 ;
    const linkedinUrl = data.profile.linkedinUrl ? 1 : 0 ;
    const resumeUrl = data.profile.resumeUrl ? data.profile.resumeUrl.length > 0 ? 1 : 0  : 0;
    const domain = data.profile.domain ? 1 : 0 ;

    const res = domain+ graduationYear+ details+ currentCompany+ fullName+ email+ phoneNo+ currentCtc+ yearsOfExperience+ bio+ skills+ linkedinUrl+ resumeUrl;
    return Math.floor(res*100/13);

}