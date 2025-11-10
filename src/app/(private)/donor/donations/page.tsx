import React from "react";
import DonationResponseForm from "./_components/donation-response-form";

const DonorDonations = () => {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Respond to Blood Request</h1>
        <p className="text-muted-foreground">
          Fill out the form to respond to a blood donation request
        </p>
      </div>
      <DonationResponseForm />
    </div>
  );
};

export default DonorDonations;
