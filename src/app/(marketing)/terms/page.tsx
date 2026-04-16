import { LegalLayout } from "@/components/layout/LegalLayout";
import Link from "next/link";

const SECTIONS = [
  { id: "overview",      title: "1. Overview" },
  { id: "definitions",   title: "2. Definitions" },
  { id: "eligibility",   title: "3. Eligibility" },
  { id: "platform",      title: "4. The Platform" },
  { id: "chefs",         title: "5. Chef Obligations" },
  { id: "food-safety",   title: "6. Food Safety & Compliance" },
  { id: "customers",     title: "7. Customer Terms" },
  { id: "payments",      title: "8. Payments & Fees" },
  { id: "prohibited",    title: "9. Prohibited Conduct" },
  { id: "ip",            title: "10. Intellectual Property" },
  { id: "liability",     title: "11. Liability & Disclaimer" },
  { id: "termination",   title: "12. Termination" },
  { id: "disputes",      title: "13. Disputes & Governing Law" },
  { id: "casl",          title: "14. Electronic Communications" },
  { id: "changes",       title: "15. Changes to Terms" },
  { id: "contact",       title: "16. Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using the Dished platform."
      effectiveDate="March 14, 2025"
      lastUpdated="March 14, 2025"
      sections={SECTIONS}
    >

      <div className="notice-box">
        <strong>Important:</strong> These Terms of Service constitute a legally binding agreement between you
        and Dished Inc. under the laws of Ontario, Canada. By accessing or using the Dished platform you
        agree to be bound by these terms. If you do not agree, do not use the platform.
      </div>

      {/* 1 */}
      <h2 id="overview">1. Overview</h2>
      <p>
        Dished Inc. ("<strong>Dished</strong>", "<strong>we</strong>", "<strong>our</strong>") operates an
        online marketplace that connects home chefs ("<strong>Chefs</strong>") with consumers
        ("<strong>Customers</strong>") for the sale and purchase of home-cooked meals and food products
        (the "<strong>Platform</strong>"). Dished is incorporated and operates in Ontario, Canada.
      </p>
      <p>
        Dished is a marketplace intermediary only. Dished does not prepare, sell, or deliver food. All food
        transactions are directly between the Chef and the Customer. Dished is not a party to any sale
        agreement and is not responsible for the quality, safety, or legality of food sold through the
        Platform.
      </p>

      {/* 2 */}
      <h2 id="definitions">2. Definitions</h2>
      <ul>
        <li><strong>"Chef"</strong> — any individual who registers to sell home-cooked food through the Platform.</li>
        <li><strong>"Customer"</strong> — any individual who purchases food through the Platform.</li>
        <li><strong>"Listing"</strong> — a Chef's posted menu item, including description, price, and availability.</li>
        <li><strong>"Order"</strong> — a confirmed transaction between a Customer and a Chef.</li>
        <li><strong>"Content"</strong> — text, images, reviews, and other material submitted by users.</li>
        <li><strong>"PIPEDA"</strong> — the <em>Personal Information Protection and Electronic Documents Act</em>, SC 2000, c 5.</li>
        <li><strong>"CASL"</strong> — Canada's <em>Anti-Spam Legislation</em>, SC 2010, c 23.</li>
      </ul>

      {/* 3 */}
      <h2 id="eligibility">3. Eligibility</h2>
      <h3>3.1 Age Requirement</h3>
      <p>
        You must be at least 18 years of age to create an account on the Platform, whether as a Chef or
        Customer. By registering, you represent and warrant that you are 18 or older.
      </p>
      <h3>3.2 Canadian Residents</h3>
      <p>
        The Platform is intended for residents of Canada. Chefs must operate from a Canadian address and
        comply with all applicable federal, provincial, and municipal laws governing home-based food
        businesses in their jurisdiction.
      </p>
      <h3>3.3 Account Accuracy</h3>
      <p>
        You agree to provide accurate, current, and complete information during registration and to keep
        your account information updated. Providing false information is grounds for immediate account
        termination.
      </p>

      {/* 4 */}
      <h2 id="platform">4. The Platform</h2>
      <h3>4.1 Marketplace Role</h3>
      <p>
        Dished provides technology infrastructure enabling Chefs and Customers to connect. Dished is a
        marketplace facilitator, not a food vendor, restaurant, caterer, or delivery service. Dished does
        not employ Chefs; Chefs operate as independent businesses.
      </p>
      <h3>4.2 No Endorsement</h3>
      <p>
        Listing a Chef on the Platform does not constitute Dished's endorsement of that Chef, their food,
        their kitchen, or their compliance with applicable regulations. Customers transact at their own risk.
      </p>
      <h3>4.3 Availability</h3>
      <p>
        Dished does not guarantee uninterrupted or error-free access to the Platform. We may perform
        maintenance, updates, or suspend service without notice.
      </p>

      {/* 5 */}
      <h2 id="chefs">5. Chef Obligations</h2>
      <h3>5.1 Independent Business</h3>
      <p>
        Chefs are independent operators, not employees, agents, or contractors of Dished. Chefs are solely
        responsible for their own business operations, tax obligations, and regulatory compliance.
      </p>
      <h3>5.2 Accurate Listings</h3>
      <p>
        Chefs must provide accurate descriptions of their food, including all ingredients, common allergens
        (as required under the <em>Food and Drug Regulations</em>, CRC, c 870), and price. Chefs must
        promptly update or remove Listings that are no longer accurate or available.
      </p>
      <h3>5.3 Allergen Disclosure</h3>
      <p>
        Under the <em>Safe Food for Canadians Regulations</em> (SOR/2018-108) and Health Canada guidelines,
        Chefs must disclose the presence of priority food allergens including: peanuts, tree nuts, sesame
        seeds, wheat, milk, eggs, fish, shellfish, soy, mustard, and sulphites. Failure to disclose known
        allergens may expose Chefs to civil and regulatory liability.
      </p>
      <h3>5.4 Taxes</h3>
      <p>
        Chefs are responsible for collecting, remitting, and reporting all applicable taxes including HST
        (Harmonized Sales Tax at 13% in Ontario) as required under the <em>Excise Tax Act</em> (Canada)
        and Ontario tax law. Dished does not collect or remit taxes on behalf of Chefs.
      </p>

      {/* 6 */}
      <h2 id="food-safety">6. Food Safety & Regulatory Compliance</h2>
      <div className="notice-box">
        Compliance with food safety laws is the Chef's sole responsibility. Dished facilitates discovery
        only and cannot verify every Chef's compliance in real time. Customers should review a Chef's
        certifications before ordering.
      </div>
      <h3>6.1 Ontario Food Premises Regulation</h3>
      <p>
        Chefs operating in Ontario must comply with <em>Ontario Regulation 493/17</em> (Food Premises)
        under the <em>Health Protection and Promotion Act</em>, RSO 1990, c H.7. This includes maintaining
        food premises that meet public health unit standards, proper food storage temperatures, and safe
        food handling practices.
      </p>
      <h3>6.2 Food Handler Certification</h3>
      <p>
        Ontario public health units strongly recommend — and many require — that persons handling food
        commercially obtain a valid Food Handler Certificate issued by an accredited provider. Chefs
        represent that they hold (or are actively pursuing) the required certification for their region.
      </p>
      <h3>6.3 Home-Based Food Business</h3>
      <p>
        Home-based food businesses in Ontario may be subject to municipal zoning by-laws, the Ontario
        Building Code, and health unit inspections. Chefs are solely responsible for obtaining all required
        permits, licences, and approvals from their local municipality and public health unit before
        accepting orders.
      </p>
      <h3>6.4 Federal Requirements</h3>
      <p>
        The <em>Safe Food for Canadians Act</em> (SC 2012, c 24) and its Regulations may apply to Chefs
        who sell food across provincial borders. Chefs are responsible for determining whether federal
        licencing applies to their operations.
      </p>
      <h3>6.5 Chef Warranty</h3>
      <p>
        By listing food on the Platform, each Chef warrants that all food offered is prepared in a safe,
        sanitary manner; complies with all applicable food safety laws; and does not contain any undisclosed
        allergens, controlled substances, or harmful ingredients.
      </p>

      {/* 7 */}
      <h2 id="customers">7. Customer Terms</h2>
      <h3>7.1 Customer Responsibility</h3>
      <p>
        Customers are responsible for reviewing Listings carefully, including ingredient and allergen
        information, before placing an Order. Customers with food allergies or dietary restrictions should
        contact the Chef directly before ordering.
      </p>
      <h3>7.2 Ontario Consumer Protection</h3>
      <p>
        Customer rights in Ontario are governed in part by the <em>Consumer Protection Act, 2002</em>,
        SO 2002, c 30, Sched A. Nothing in these Terms limits any statutory rights you have as a consumer
        under applicable Ontario or federal law.
      </p>
      <h3>7.3 Disputes with Chefs</h3>
      <p>
        Disputes about food quality, non-delivery, or overcharging are between the Customer and the Chef.
        Dished will use reasonable efforts to mediate reported disputes but is not obligated to provide
        refunds for transactions between Chefs and Customers. Contact{" "}
        <a href="mailto:support@dished.ca">support@dished.ca</a> to report a dispute.
      </p>

      {/* 8 */}
      <h2 id="payments">8. Payments & Fees</h2>
      <h3>8.1 Payment Collection</h3>
      <p>
        Currently, payment for Orders is collected directly by the Chef at the time of delivery or pickup.
        Dished does not process payments on behalf of Chefs. Future versions of the Platform may introduce
        in-app payment processing; updated terms will apply.
      </p>
      <h3>8.2 Platform Fees</h3>
      <p>
        Dished may charge Chefs a platform fee or commission for use of the Platform. The applicable fee
        structure will be communicated to Chefs at registration and updated via email with at least 30 days'
        notice of any change. The first month of listing is commission-free.
      </p>
      <h3>8.3 HST</h3>
      <p>
        Where applicable, HST (Ontario: 13%) will be applied to any fees charged by Dished to Chefs.
        Dished's HST registration number will be provided upon request.
      </p>

      {/* 9 */}
      <h2 id="prohibited">9. Prohibited Conduct</h2>
      <p>The following are strictly prohibited on the Platform:</p>
      <ul>
        <li>Listing or selling food that contains controlled substances, cannabis (unless provincially licensed), or any ingredient whose sale to the public is restricted or prohibited.</li>
        <li>Misrepresenting ingredients, allergens, portion sizes, or certifications.</li>
        <li>Creating false reviews or manipulating rating systems.</li>
        <li>Using the Platform to harass, threaten, or discriminate against other users on any ground protected under the <em>Ontario Human Rights Code</em>, RSO 1990, c H.19.</li>
        <li>Attempting to circumvent Platform fees by arranging off-Platform transactions after initial contact through Dished.</li>
        <li>Scraping, reverse-engineering, or otherwise interfering with Platform infrastructure.</li>
        <li>Creating multiple accounts to evade a suspension or ban.</li>
      </ul>

      {/* 10 */}
      <h2 id="ip">10. Intellectual Property</h2>
      <p>
        The Dished name, logo, design, and software are owned by Dished Inc. and protected by Canadian
        copyright, trademark, and other intellectual property laws. You may not use Dished's marks without
        prior written permission.
      </p>
      <p>
        By submitting Content to the Platform (photos, recipes, descriptions, reviews), you grant Dished a
        non-exclusive, royalty-free, worldwide licence to use, display, and distribute that Content solely
        to operate and promote the Platform. You retain ownership of your Content and may request its
        removal at any time.
      </p>

      {/* 11 */}
      <h2 id="liability">11. Liability & Disclaimer</h2>
      <h3>11.1 Platform Provided "As Is"</h3>
      <p>
        The Platform is provided on an "as is" and "as available" basis without warranties of any kind,
        express or implied, to the maximum extent permitted by applicable Ontario and Canadian law.
      </p>
      <h3>11.2 Limitation of Liability</h3>
      <p>
        To the maximum extent permitted by the <em>Consumer Protection Act, 2002</em> (Ontario) and other
        applicable law, Dished's total liability to you for any claim arising from use of the Platform shall
        not exceed the greater of CAD $100 or the platform fees paid by you in the 3 months preceding the
        claim.
      </p>
      <h3>11.3 Food Safety Liability</h3>
      <p>
        Dished is not liable for any illness, injury, allergic reaction, or harm resulting from food
        purchased through the Platform. Chefs bear sole responsibility for the safety and quality of their
        food. Customers assume the risk of purchasing food from home-based businesses.
      </p>
      <h3>11.4 Statutory Rights Preserved</h3>
      <p>
        Nothing in these Terms excludes, restricts, or modifies any right or remedy you have under the
        <em> Consumer Protection Act, 2002</em> or any other non-excludable provision of Ontario or Canadian
        consumer law.
      </p>

      {/* 12 */}
      <h2 id="termination">12. Termination</h2>
      <p>
        Dished may suspend or terminate your account at any time for violation of these Terms, fraudulent
        activity, regulatory non-compliance, or conduct harmful to other users or Dished's reputation.
        Chefs will receive notice of termination except in cases of serious or criminal misconduct.
      </p>
      <p>
        You may delete your account at any time by contacting{" "}
        <a href="mailto:support@dished.ca">support@dished.ca</a>. Account deletion does not extinguish
        any obligations arising from Orders placed before deletion.
      </p>

      {/* 13 */}
      <h2 id="disputes">13. Disputes & Governing Law</h2>
      <h3>13.1 Governing Law</h3>
      <p>
        These Terms are governed by and construed in accordance with the laws of the Province of Ontario
        and the federal laws of Canada applicable therein, without regard to conflict of law principles.
      </p>
      <h3>13.2 Jurisdiction</h3>
      <p>
        You agree that any legal action or proceeding arising out of or relating to these Terms or your use
        of the Platform shall be brought exclusively in the courts of the Province of Ontario, and you
        irrevocably submit to the personal jurisdiction of those courts.
      </p>
      <h3>13.3 Dispute Resolution</h3>
      <p>
        Before commencing legal proceedings, you agree to contact Dished at{" "}
        <a href="mailto:legal@dished.ca">legal@dished.ca</a> to attempt to resolve the dispute informally.
        Dished will respond within 15 business days.
      </p>

      {/* 14 */}
      <h2 id="casl">14. Electronic Communications (CASL)</h2>
      <p>
        By creating an account, you provide express consent under Canada's <em>Anti-Spam Legislation</em>
        (CASL) to receive transactional electronic messages from Dished related to your account, Orders,
        and Platform updates. These are not commercial electronic messages and will be sent regardless of
        marketing preferences.
      </p>
      <p>
        We may also send commercial electronic messages (newsletters, promotions) with your separate
        express or implied consent, as defined under CASL. You may withdraw consent to commercial messages
        at any time by clicking "Unsubscribe" in any commercial email or by contacting{" "}
        <a href="mailto:privacy@dished.ca">privacy@dished.ca</a>. Withdrawal of consent does not affect the
        lawfulness of messages sent before withdrawal.
      </p>

      {/* 15 */}
      <h2 id="changes">15. Changes to These Terms</h2>
      <p>
        Dished may update these Terms from time to time. Material changes will be communicated by email to
        your registered address at least 14 days before taking effect. Continued use of the Platform after
        the effective date constitutes acceptance of the revised Terms.
      </p>
      <p>
        If you do not agree to revised Terms, you must stop using the Platform and may request account
        deletion before the effective date.
      </p>

      {/* 16 */}
      <h2 id="contact">16. Contact</h2>
      <p>For questions about these Terms:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:legal@dished.ca">legal@dished.ca</a></li>
        <li><strong>Support:</strong> <a href="mailto:support@dished.ca">support@dished.ca</a></li>
        <li><strong>Company:</strong> Dished Inc., Toronto, Ontario, Canada</li>
      </ul>
      <p>
        See also our <Link href="/privacy">Privacy Policy</Link> for information on how we handle your
        personal information.
      </p>

    </LegalLayout>
  );
}
