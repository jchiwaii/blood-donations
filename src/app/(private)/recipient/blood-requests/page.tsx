import React from "react";
import CreateRequestForm from "./_components/create-request-form";

const RecipientBloodRequest = () => {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Blood Request</h1>
        <p className="text-muted-foreground">
          Fill out the form below to request blood donation
        </p>
      </div>
      {/* Create mode - no editData prop */}
      <CreateRequestForm />
    </div>
  );
};

export default RecipientBloodRequest;
