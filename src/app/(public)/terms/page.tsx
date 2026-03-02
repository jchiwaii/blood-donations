import LegalPageShell from "../_components/legal-page-shell";

const sections = [
  {
    title: "Using the platform",
    paragraphs: [
      "By accessing Redflow, you agree to use the platform responsibly and only for lawful blood donation, coordination, and community support purposes.",
      "You must provide accurate information when creating an account, submitting a request, or responding to a donation opportunity.",
    ],
  },
  {
    title: "Eligibility and accounts",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it.",
      "If your eligibility to donate changes, you agree to update your profile so coordinators and recipients are not relying on outdated information.",
    ],
  },
  {
    title: "Donor and recipient responsibilities",
    paragraphs: [
      "Donors, recipients, and coordinators must act respectfully, communicate honestly, and follow medical guidance provided by licensed professionals and collection centers.",
      "Redflow supports coordination and communication, but medical screening, collection, storage, and transfusion decisions remain with qualified healthcare providers.",
    ],
  },
  {
    title: "Prohibited conduct",
    paragraphs: [
      "You may not misuse the platform to submit false requests, impersonate another person, interfere with the service, scrape protected data, or use the platform for harassment or discrimination.",
      "We may suspend or remove accounts that put users, hospitals, or partner organizations at risk.",
    ],
  },
  {
    title: "Availability and updates",
    paragraphs: [
      "We may improve, modify, or discontinue parts of the platform at any time in order to maintain service quality, safety, and operational reliability.",
      "We aim for dependable access, but we do not guarantee uninterrupted availability in every location or circumstance.",
    ],
  },
  {
    title: "Limitation and contact",
    paragraphs: [
      "Redflow is provided as a coordination platform. Except where required by law, we are not liable for indirect or consequential losses arising from your use of the service.",
      "For questions about these terms, contact hello@redflow.org.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms"
      title="Terms of Use for the Redflow donation and coordination platform."
      intro="These terms explain the rules for using Redflow, creating an account, coordinating donations, and interacting with our donor-first community network."
      lastUpdated="March 2, 2026"
      highlights={[
        "Account responsibility",
        "Platform rules",
        "Medical coordination boundaries",
      ]}
      sections={sections}
    />
  );
}
