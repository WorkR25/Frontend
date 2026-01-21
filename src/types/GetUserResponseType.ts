import { Skills } from "./JobDetailsType";

export type GetUserResponseType = {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  graduationYear: string;
  profile: {
    bio: string | null;
    currentCompany: string | null;
    currentCtc: string | null;
    currentLocation: {
      name: string | null;
    } | null;
    currentLocationId: number | null;
    details: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
    yearsOfExperience: number | null;
    domain: string | null;
  };
  skills: Skills[];
};
