export type Job = {
  id: number;          
  jobTitle: {
    title: string;
  };    
  companyId: {
    name: string;  
    logo: string;    
  };
  city: string;
  state: string;
  country: string;    
  city_id: number;     
  is_remote: boolean;  
  skills: string[];
  salary_min: string;
  salary_max: string;
  apply_link: string;
  created_at: Date;
};

export type JobResponse= {
    data: Job[];
}