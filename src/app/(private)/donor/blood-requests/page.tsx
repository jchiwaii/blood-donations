import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";
import React from "react";

async function DonorBloodRequests() {
  const response = await getApprovedBloodRequests();
  return <div>DonorBloodRequests</div>;
}

export default DonorBloodRequests;
