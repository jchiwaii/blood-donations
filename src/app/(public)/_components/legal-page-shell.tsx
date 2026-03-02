type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  highlights: string[];
  sections: LegalSection[];
};

export default function LegalPageShell({
  eyebrow,
  title,
  intro,
  lastUpdated,
  highlights,
  sections,
}: LegalPageShellProps) {
  return (
    <div className="relative overflow-hidden pb-20 text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          background:
            "radial-gradient(circle at 88% -8%, rgba(196,44,43,0.12), transparent 30%), radial-gradient(circle at 8% 18%, rgba(180,83,9,0.08), transparent 24%)",
        }}
      />

      <section className="relative px-6 pb-8 pt-16 sm:px-10 sm:pt-20">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-border/70 bg-card/80 p-7 shadow-sm backdrop-blur-sm sm:p-10">
          <p className="type-section-name text-primary">{eyebrow}</p>
          <h1 className="type-heading-xl mt-4 max-w-4xl text-balance">
            {title}
          </h1>
          <p className="type-body-lg mt-5 max-w-3xl text-muted-foreground">
            {intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-foreground/80"
              >
                {highlight}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="px-6 pb-4 pt-4 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className={`rounded-3xl border border-border/70 bg-card/75 p-6 shadow-sm ${
                sections.length % 2 === 1 && index === sections.length - 1
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <h2 className="type-title text-balance">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="type-body text-pretty text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
