export type Job = {
  id: number;
  jobTitle: {
    title: string;
  };
  company: {
    id?: number;
    name: string;
    logo: string;
  };
  employmentType: {
    name: string;
  };
  city: string;
  state: string;
  country: string;
  city_id: number;
  location_id?: number;
  is_remote: boolean;
  skills: string[];
  salary_min: string;
  salary_max: string;
  apply_link: string;
  created_at: Date;
};

export type JobResponse = {
  data: Job[];
};

export const JOB_LIST_TABS = ["all", "new", "remote", "onsite", "intern"] as const;
export type JobListTab = (typeof JOB_LIST_TABS)[number];

export type JobTabCounts = Record<JobListTab, number>;

export type JobListPagination = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type JobListResponse = {
  records: Job[];
  pagination: JobListPagination;
  counts?: JobTabCounts;
};

export type HiringCompany = {
  id: number;
  name: string;
  logo: string | null;
  jobCount: number;
};
