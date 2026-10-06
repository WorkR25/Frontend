import { Suspense } from "react";
import TripleDotLoader from "@/components/TripleDotLoader";
import ExploreJobs from "@/components/exploreJobs/ExploreJobs";

export default function Page() {
  return (
    <Suspense fallback={<TripleDotLoader />}>
      <ExploreJobs />
    </Suspense>
  );
}
