
export type JobCardParams = {
  id: number;
  img?: string;
  title: string;
  company: string;
  employmentType: string;
  city: string;
  country: string;
  minPay: string;
  maxPay: string;
  applyLink?: string;
  className?: string;
  created_at?: Date; 
};