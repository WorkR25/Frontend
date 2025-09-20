import { Skills } from "./JobDetailsType";

export type GetUserResponseType = {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  graduationYear: string;
  profile: {
    bio: string | null;
    currentCompanyId: number | null;
    currentCtc: string | null;
    currentLocation: {
      name: string | null;
    } | null;
    currentLocationId: number | null;
    isFresher: boolean | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
    yearsOfExperience: number | null;
  };
  skills: Skills[];
};
