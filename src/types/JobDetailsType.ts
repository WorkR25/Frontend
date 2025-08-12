export type Skills= {
  id: number;
  name: string;
}

export type JobDetails = {
  apply_link: string;
  city: {
    name: string;
  };
  companyId: {
    name: string;
    logo: string;
  };
  employmentType: {
    name: string;
  };
  experienceLevel: {
    name: string;
  };
  is_remote: boolean;
  jobTitle: {
    title: string;
  };
  salary_max: string;
  salary_min: string;
  skills: Skills[];
};
