import CompanyCard from "./CompanyCard";
import JobInfoCard from "./JobInfoCard";

export default function JobSpecification() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <JobInfoCard label="Level" value="Mid Senior" className="w-[48%]" />
        <JobInfoCard label="Experience" value="2 years" className="w-[48%]" />
        <JobInfoCard label="Job Type" value="Full Time" className="w-[48%]" />
        <JobInfoCard label="Work Type" value="Remote" className="w-[48%]" />
        <JobInfoCard
          label="Salary Range"
          value="2000000-4000000"
          className="w-[96%]"
        />
      </div>

      <CompanyCard
        logoUrl="/google-icon-logo-svgrepo-com.svg"
        name="Advanta Inc."
        location="California, United States"
        industry="Technology Information"
        size="11 - 50 Employee"
        description="At Advanta Inc., we are pioneers in delivering cutting-edge solutions that drive innovation and efficiency. At Advanta Inc., we are pioneers in delivering cutting-edge solutions that drive innovation and efficiency. At Advanta Inc., we are pioneers in delivering cutting-edge solutions that drive innovation and efficiency"
      />
    </div>
  );
}