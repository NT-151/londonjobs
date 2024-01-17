import { useRouter } from "next/router";

function JobDetail() {
  const router = useRouter();
  const { jobId } = router.query;

  // Fetch job details using jobId and render them on this page

  return <div>{/* Render job details here */}</div>;
}

export default JobDetail;
