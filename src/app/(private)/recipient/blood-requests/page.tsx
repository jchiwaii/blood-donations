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

      {/* Edit mode example - pass editData with existing request
      <CreateRequestForm 
        editData={{
          id: 1,
          title: "Urgent Blood Needed",
          description: "Patient needs blood for surgery",
          blood_group: "A+",
          units_required: 2,
          urgency: "high",
          contact_phone: "+1234567890",
          contact_email: "contact@example.com",
          address: "123 Hospital St"
        }}
        onSuccess={() => {
          // Handle success (e.g., close modal, redirect)
        }}
      />
      */}
    </div>
  );
};

export default RecipientBloodRequest;
