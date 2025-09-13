export type Skills = {
  id: number;
  name: string;
};

export type JobDetails = {
  apply_link: string;
  city: {
    name: string;
  };
  company: {
    name: string;
    logo: string;
    description: string;
    companySize: {
      min_employees: number;
      max_employees: number;
    };
    industry: {
      name: string;
    };
  };

  employmentType: {
    name: string;
  };
  experienceLevel: {
    name: string;
    min_years: number;
    max_years: number;
  };
  is_remote: boolean;
  jobTitle: {
    title: string;
  };
  salary_max: string;
  salary_min: string;
  skills: Skills[];
  description: string;
  created_at: Date;
};
