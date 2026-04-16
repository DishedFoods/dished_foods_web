import { LegalLayout } from "@/components/layout/LegalLayout";
import Link from "next/link";

const SECTIONS = [
  { id: "overview",      title: "1. Overview" },
  { id: "who-we-are",    title: "2. Who We Are" },
  { id: "what-we-collect", title: "3. Information We Collect" },
  { id: "how-we-use",    title: "4. How We Use Your Information" },
  { id: "sharing",       title: "5. Sharing Your Information" },
  { id: "cookies",       title: "6. Cookies & Tracking" },
  { id: "retention",     title: "7. Data Retention" },
  { id: "cross-border",  title: "8. Cross-Border Transfers" },
  { id: "your-rights",   title: "9. Your Rights (PIPEDA)" },
  { id: "children",      title: "10. Children's Privacy" },
  { id: "casl",          title: "11. Marketing Consent (CASL)" },
  { id: "security",      title: "12. Security" },
  { id: "changes",       title: "13. Changes to This Policy" },
  { id: "contact",       title: "14. Contact & Complaints" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Dished collects, uses, and protects your personal information."
      effectiveDate="March 14, 2025"
      lastUpdated="March 14, 2025"
      sections={SECTIONS}
    >

      <div className="notice-box">
        Dished Inc. is committed to protecting your privacy in compliance with Canada's{" "}
        <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA), SC 2000, c 5, and
        all applicable Ontario privacy laws. This Policy explains what personal information we collect,
        why we collect it, and your rights regarding that information.
      </div>

      {/* 1 */}
      <h2 id="overview">1. Overview</h2>
      <p>
        This Privacy Policy applies to all personal information collected by Dished Inc.
        ("<strong>Dished</strong>", "<strong>we</strong>", "<strong>our</strong>") through the Dished
        website, mobile applications, and related services (collectively, the "<strong>Platform</strong>").
      </p>
      <p>
        By using the Platform, you consent to the collection, use, and disclosure of your personal
        information as described in this Policy. If you do not agree, please do not use the Platform.
      </p>

      {/* 2 */}
      <h2 id="who-we-are">2. Who We Are</h2>
      <p>
        Dished Inc. is the organization responsible for your personal information and is the "organization"
        as defined under PIPEDA. Our Privacy Officer can be reached at{" "}
        <a href="mailto:privacy@dished.ca">privacy@dished.ca</a>.
      </p>
      <p>
        We operate in Ontario, Canada and serve Canadians across all provinces. Our principal place of
        business is in Toronto, Ontario.
      </p>

      {/* 3 */}
      <h2 id="what-we-collect">3. Information We Collect</h2>
      <h3>3.1 Information You Provide</h3>
      <ul>
        <li><strong>Account registration:</strong> Full name, email address, password (hashed), phone number.</li>
        <li><strong>Chef profile:</strong> Home address, city, province, postal code, bio, cuisine types, cooking experience, price range, and food safety certification status.</li>
        <li><strong>Order information:</strong> Delivery address, special instructions, items ordered.</li>
        <li><strong>Communications:</strong> Messages sent through the Platform, support requests, reviews.</li>
        <li><strong>Identity verification:</strong> Where required, proof of food handler certification or other regulatory documents.</li>
      </ul>
      <h3>3.2 Information Collected Automatically</h3>
      <ul>
        <li><strong>Device and log data:</strong> IP address, browser type, operating system, pages visited, timestamps.</li>
        <li><strong>Cookies and similar technologies:</strong> Session identifiers, preferences. See Section 6.</li>
        <li><strong>Location data:</strong> General location derived from IP address for displaying nearby Chefs. We do not collect precise GPS location without explicit consent.</li>
      </ul>
      <h3>3.3 Information from Third Parties</h3>
      <ul>
        <li><strong>Google OAuth:</strong> If you sign in with Google, we receive your name, email address, and Google profile photo as permitted by Google's privacy settings.</li>
        <li><strong>Payment processors:</strong> If future in-app payments are introduced, payment information will be handled by a PCI-DSS-compliant processor; Dished will not store full card numbers.</li>
      </ul>

      {/* 4 */}
      <h2 id="how-we-use">4. How We Use Your Information</h2>
      <p>We collect and use personal information only for identified purposes, as required by PIPEDA Principle 4:</p>
      <ul>
        <li><strong>Platform operation:</strong> Creating and managing your account, enabling Chef-Customer connections, processing Orders.</li>
        <li><strong>Safety and compliance:</strong> Verifying Chef certifications, investigating reports of non-compliance with food safety or community standards.</li>
        <li><strong>Communications:</strong> Sending transactional emails (order confirmations, account notices) as required for service delivery.</li>
        <li><strong>Marketing:</strong> Sending promotional content <em>only</em> with your express or implied CASL consent (see Section 11).</li>
        <li><strong>Analytics and improvement:</strong> Understanding how the Platform is used to improve features. Data is aggregated and anonymized where possible.</li>
        <li><strong>Legal obligations:</strong> Complying with applicable Canadian law, court orders, or regulatory requirements.</li>
        <li><strong>Fraud prevention:</strong> Detecting and preventing fraudulent, abusive, or harmful activity.</li>
      </ul>
      <p>
        We do not use your personal information for automated decision-making that produces legal or
        similarly significant effects without human review.
      </p>

      {/* 5 */}
      <h2 id="sharing">5. Sharing Your Information</h2>
      <p>
        Dished does not sell your personal information. We share personal information only in the following
        limited circumstances:
      </p>
      <h3>5.1 Between Chefs and Customers</h3>
      <p>
        When a Customer places an Order, their name, delivery address, and special instructions are shared
        with the Chef to fulfil the Order. Chef profiles — including name, location (city/neighbourhood),
        bio, and cuisines — are publicly visible on the Platform.
      </p>
      <h3>5.2 Service Providers</h3>
      <p>
        We engage trusted third-party service providers to help operate the Platform, including:
      </p>
      <ul>
        <li><strong>Supabase Inc.</strong> — database and authentication infrastructure. Data may be stored on servers in the United States (see Section 8).</li>
        <li><strong>Vercel Inc.</strong> — web hosting and content delivery.</li>
        <li><strong>Google LLC</strong> — OAuth sign-in and analytics.</li>
      </ul>
      <p>
        All service providers are contractually required to protect your information and use it only for the
        purposes for which it was disclosed.
      </p>
      <h3>5.3 Legal Requirements</h3>
      <p>
        We may disclose personal information if required by law, subpoena, court order, or a request from a
        regulatory authority (e.g., a local public health unit investigating a food safety complaint).
      </p>
      <h3>5.4 Business Transfers</h3>
      <p>
        In the event of a merger, acquisition, or sale of Dished assets, personal information may be
        transferred as part of that transaction. We will notify you by email and/or Platform notice before
        such a transfer takes effect.
      </p>

      {/* 6 */}
      <h2 id="cookies">6. Cookies & Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies to maintain your session, remember your preferences, and
        understand how you use the Platform. We use the following categories:
      </p>
      <ul>
        <li><strong>Strictly necessary cookies:</strong> Required for the Platform to function (authentication session, security tokens). Cannot be disabled.</li>
        <li><strong>Analytics cookies:</strong> Help us understand usage patterns (e.g., Google Analytics with IP anonymisation enabled). You may opt out via your browser settings.</li>
        <li><strong>Preference cookies:</strong> Remember your settings such as language or region.</li>
      </ul>
      <p>
        You can control cookies through your browser settings. Disabling strictly necessary cookies may
        prevent you from signing in or using core Platform features.
      </p>

      {/* 7 */}
      <h2 id="retention">7. Data Retention</h2>
      <p>
        We retain your personal information only as long as necessary for the purposes for which it was
        collected, subject to any legal obligations requiring longer retention:
      </p>
      <ul>
        <li><strong>Active accounts:</strong> For as long as your account remains active.</li>
        <li><strong>Deleted accounts:</strong> Core account data is deleted within 30 days of account deletion. Anonymized transaction records may be retained for up to 7 years for accounting and tax compliance under the <em>Income Tax Act</em> (Canada) and Ontario tax law.</li>
        <li><strong>Order records:</strong> Retained for 7 years from the transaction date to satisfy CRA requirements.</li>
        <li><strong>Support communications:</strong> Retained for 2 years after resolution.</li>
      </ul>

      {/* 8 */}
      <h2 id="cross-border">8. Cross-Border Transfers</h2>
      <p>
        Some of our service providers, including Supabase Inc. and Vercel Inc., may store or process your
        personal information in the United States. When your information is transferred outside Canada, it
        may be subject to the laws of the jurisdiction where it is stored, including potential access by
        law enforcement authorities.
      </p>
      <p>
        We take steps to ensure that any cross-border transfer is subject to appropriate contractual
        protections consistent with PIPEDA requirements. By using the Platform, you consent to this transfer
        as described in this Policy.
      </p>

      {/* 9 */}
      <h2 id="your-rights">9. Your Rights Under PIPEDA</h2>
      <p>
        Under PIPEDA, you have the following rights regarding your personal information held by Dished:
      </p>
      <ul>
        <li><strong>Right of access:</strong> You may request access to the personal information we hold about you, free of charge, within 30 days of your request.</li>
        <li><strong>Right to correction:</strong> If your information is inaccurate or incomplete, you have the right to request a correction. We will correct or annotate the information as appropriate.</li>
        <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, you may withdraw consent at any time, subject to legal or contractual restrictions. Withdrawal may affect your ability to use the Platform.</li>
        <li><strong>Right to deletion:</strong> You may request deletion of your personal information. We will comply unless retention is required by law.</li>
        <li><strong>Right to complain:</strong> If you are unsatisfied with our handling of your personal information, you may file a complaint with the <strong>Office of the Privacy Commissioner of Canada</strong> at <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a>.</li>
      </ul>
      <p>
        To exercise any of these rights, contact our Privacy Officer at{" "}
        <a href="mailto:privacy@dished.ca">privacy@dished.ca</a>. We will respond within 30 days.
      </p>

      {/* 10 */}
      <h2 id="children">10. Children&apos;s Privacy</h2>
      <p>
        The Platform is not directed to persons under 18 years of age. We do not knowingly collect personal
        information from children. If you believe a child has registered on the Platform, please contact us
        immediately at <a href="mailto:privacy@dished.ca">privacy@dished.ca</a> and we will promptly delete
        the account and associated information.
      </p>

      {/* 11 */}
      <h2 id="casl">11. Marketing Consent (CASL)</h2>
      <p>
        Under Canada's <em>Anti-Spam Legislation</em> (CASL), we distinguish between:
      </p>
      <ul>
        <li>
          <strong>Transactional messages</strong> (e.g., order confirmations, password resets, account
          alerts) — sent as necessary to operate the service; not subject to CASL opt-out.
        </li>
        <li>
          <strong>Commercial electronic messages</strong> (e.g., newsletters, promotions, new Chef
          announcements) — sent only with your express or implied consent, as defined under CASL s.6.
        </li>
      </ul>
      <p>
        You may withdraw consent to commercial messages at any time by clicking "Unsubscribe" in any
        promotional email, or by emailing <a href="mailto:privacy@dished.ca">privacy@dished.ca</a>. We will
        action your request within 10 business days as required by CASL.
      </p>

      {/* 12 */}
      <h2 id="security">12. Security</h2>
      <p>
        We implement industry-standard technical and organizational safeguards to protect your personal
        information against unauthorized access, disclosure, alteration, or destruction. These include:
      </p>
      <ul>
        <li>TLS/HTTPS encryption for all data in transit.</li>
        <li>Bcrypt password hashing — Dished never stores plaintext passwords.</li>
        <li>Row-level security on our database (Supabase RLS policies).</li>
        <li>Access controls limiting employee access to personal data on a need-to-know basis.</li>
      </ul>
      <p>
        No method of electronic transmission or storage is 100% secure. If you become aware of any
        security vulnerability or breach, please report it immediately to{" "}
        <a href="mailto:security@dished.ca">security@dished.ca</a>.
      </p>

      {/* 13 */}
      <h2 id="changes">13. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        applicable law. Material changes will be communicated by email to your registered address at least
        14 days before taking effect. We encourage you to review this Policy periodically.
      </p>
      <p>
        Continued use of the Platform after an updated Policy takes effect constitutes acceptance of the
        revised Policy. If you do not agree, you may delete your account before the effective date.
      </p>

      {/* 14 */}
      <h2 id="contact">14. Contact & Complaints</h2>
      <p>
        Our Privacy Officer is responsible for Dished's compliance with PIPEDA and this Privacy Policy.
        To ask questions, make a request, or file a complaint:
      </p>
      <ul>
        <li><strong>Privacy Officer email:</strong> <a href="mailto:privacy@dished.ca">privacy@dished.ca</a></li>
        <li><strong>General support:</strong> <a href="mailto:support@dished.ca">support@dished.ca</a></li>
        <li><strong>Mailing address:</strong> Privacy Officer, Dished Inc., Toronto, Ontario, Canada</li>
      </ul>
      <p>
        If we are unable to resolve your complaint to your satisfaction, you have the right to escalate to:
      </p>
      <ul>
        <li>
          <strong>Office of the Privacy Commissioner of Canada</strong> —{" "}
          <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a>
          {" "}· 1-800-282-1376
        </li>
        <li>
          <strong>Information and Privacy Commissioner of Ontario</strong> —{" "}
          <a href="https://www.ipc.on.ca" target="_blank" rel="noopener noreferrer">www.ipc.on.ca</a>
          {" "}· 1-800-387-0073
        </li>
      </ul>
      <p>
        See also our <Link href="/terms">Terms of Service</Link> for the full agreement governing your use
        of the Dished Platform.
      </p>

    </LegalLayout>
  );
}
