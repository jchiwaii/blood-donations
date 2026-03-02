import LegalPageShell from "../_components/legal-page-shell";

const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "We collect information you provide directly, such as your name, email address, account role, and any profile or request details you submit through the platform.",
      "We may also collect technical information such as device, browser, and usage data to help maintain performance, security, and fraud prevention.",
    ],
  },
  {
    title: "How we use your information",
    paragraphs: [
      "We use your information to operate the platform, support donor and recipient coordination, authenticate accounts, improve service quality, and communicate important updates.",
      "Where appropriate, we also use data to monitor abuse, detect security issues, and maintain operational accountability.",
    ],
  },
  {
    title: "Sharing and disclosure",
    paragraphs: [
      "We only share information when necessary to provide the service, comply with law, protect users, or support trusted partners involved in the coordination workflow.",
      "We do not sell personal information as part of the normal operation of Redflow.",
    ],
  },
  {
    title: "Cookies and authentication",
    paragraphs: [
      "We use cookies and similar storage tools to keep you signed in, remember session state, and support a secure experience across the platform.",
      "Disabling cookies may affect account access and some platform features.",
    ],
  },
  {
    title: "Retention and security",
    paragraphs: [
      "We retain information only as long as needed for service delivery, legitimate operational needs, or legal compliance.",
      "We apply reasonable safeguards to protect personal information, but no online system can guarantee absolute security.",
    ],
  },
  {
    title: "Your choices and contact",
    paragraphs: [
      "You may request updates or corrections to your account information, and you may contact us with questions about how your data is handled.",
      "For privacy-related requests, contact hello@redflow.org.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy Policy"
      title="How Redflow collects, uses, stores, and protects personal information."
      intro="This policy outlines the information we handle when you use Redflow and the steps we take to support secure, transparent, and responsible data practices."
      lastUpdated="March 2, 2026"
      highlights={[
        "Data collection",
        "Use and sharing",
        "Security and user choices",
      ]}
      sections={sections}
    />
  );
}
