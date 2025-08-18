// ApplicantCard.tsx
import React from "react";

interface ApplicantCardProps {
  name: string;
  email: string;
  city: string;
  resumeUrl: string | null;
}

export default function ApplicantCard({
  name,
  email,
  city,
  resumeUrl,
}: ApplicantCardProps) {
  return (
    <div className="component-viewApplicants-ApplicantCard flex justify-between border rounded-lg p-4 shadow-sm bg-white w-full">
      <div className="component-viewApplicants-ApplicantCard ">
        <h3 className="component-viewApplicants-ApplicantCard text-lg font-semibold">{name}</h3>
        <p className="component-viewApplicants-ApplicantCard text-gray-600">{email}</p>
        <p className="component-viewApplicants-ApplicantCard text-gray-500">{city}</p>
      </div>
      <div className="component-viewApplicants-ApplicantCard items-center flex ">
        {!resumeUrl ? <a className="font-medium text-md bg-blue-300 py-1.5 px-2 rounded-lg" href={"resumeUrl"}> Resume</a> : <div>No resume</div>}
      </div>
    </div>
  );
}
