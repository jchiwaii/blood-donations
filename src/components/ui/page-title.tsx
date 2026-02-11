import React from "react";
import { cn } from "@/lib/utils";

type PageTitleProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  className?: string;
};

const PageTitle = ({ title, eyebrow, subtitle, className }: PageTitleProps) => {
  return (
    <header className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
};

export default PageTitle;
