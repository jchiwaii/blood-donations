import CreateRequestForm from "./_components/create-request-form";

const RecipientBloodRequest = () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Recipient</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Create Blood Request
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Submit accurate medical and contact details so compatible donors can respond quickly.
        </p>
      </header>

      <CreateRequestForm />
    </div>
  );
};

export default RecipientBloodRequest;
