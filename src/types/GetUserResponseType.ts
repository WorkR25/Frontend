export type GetUserResponseType = {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  profile: {
    bio: string | null;
    currentCompanyId: number | null;
    currentCtc: number | null;
    currentLocation: string | null;
    currentLocationId: number | null;
    isFresher: boolean | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
    yearsOfExperience: number | null;
  };
  skills: string[]; 
};
