import CompanyCard from "./CompanyCard";
import JobInfoCard from "./JobInfoCard";

type JobSpecificationProps = {
  experienceLevel: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  workType: boolean;
  img: string;
  city: string;
  companyName: string;
};

export default function JobSpecification({
  experienceLevel,
  employmentType,
  salaryMin,
  salaryMax,
  workType,
  img,
  city,
  companyName,
}: JobSpecificationProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <JobInfoCard label="Level" value="Mid Senior" className="w-[48%] " />
        <JobInfoCard
          label="Experience"
          value={experienceLevel}
          className="w-[48%]"
        />
        <JobInfoCard
          label="Job Type"
          value={employmentType}
          className="w-[48%]"
        />
        <JobInfoCard
          label="Work Type"
          value={workType ? "Remote" : "On-site"}
          className="w-[48%]"
        />
        <JobInfoCard
          label="Salary Range"
          value={
            employmentType === "Internship"
              ? `${Number(salaryMin)}K-${Number(salaryMax)}K`
              : `${Number(salaryMin)}LPA-${
                  Number(salaryMax)}LPA`
          }
          className="w-[96%]"
        />
      </div>

      <CompanyCard
        logoUrl={img ? img : "/google-icon-logo-svgrepo-com.svg"}
        name={companyName}
        location={city}
        industry="Technology Information"
        size="11 - 50 Employee"
        description="At Advanta Inc., we are pioneers in delivering cutting-edge solutions that drive innovation and efficiency. At Advanta Inc., we are pioneers in delivering cutting-edge solutions that drive innovation and efficiency. At Advanta Inc., we are pioneers in delivering cutting-edge solutions that drive innovation and efficiency"
      />
    </div>
  );
}
