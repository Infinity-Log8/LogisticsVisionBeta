import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Logistic Visions",
  description: "Terms of Service for the Logistic Visions platform.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">Logistic Visions</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
          </nav>
        </div>
      </header>
      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 16, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-3">By accessing or using Logistic Visions (&quot;the Platform&quot;), operated by <strong>Infinity Logistics (Pty) Ltd</strong>, a company registered in the Republic of Namibia, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Platform.</p>
          <p className="text-gray-700 leading-relaxed">These Terms constitute a legally binding agreement between you and Infinity Logistics (Pty) Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Logistic Visions is a cloud-based logistics management platform that provides tools for:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>Trip management and tracking</li>
            <li>Fleet and vehicle management</li>
            <li>Customer relationship management</li>
            <li>Financial management (invoicing, quotes, reconciliation)</li>
            <li>Human resources and payroll</li>
            <li>Brokerage commission management</li>
            <li>AI-powered analytics and recommendations</li>
            <li>Document management</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Account Registration</h2>
          <p className="text-gray-700 leading-relaxed mb-3">To use the Platform, you must create an account or be invited by an existing organisation. You agree to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorised access to your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">We reserve the right to suspend or terminate accounts that violate these Terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Multi-Tenant Architecture</h2>
          <p className="text-gray-700 leading-relaxed mb-3">The Platform operates on a multi-tenant model where each organisation (&quot;tenant&quot;) has its own isolated workspace. Organisation administrators are responsible for:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>Managing user access and permissions within their organisation</li>
            <li>Ensuring appropriate use of the Platform by their team members</li>
            <li>Maintaining the accuracy of their organisation&apos;s data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to other users&apos; data or accounts</li>
            <li>Interfere with or disrupt the Platform&apos;s infrastructure</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Reverse-engineer, decompile, or disassemble the Platform</li>
            <li>Use automated tools to scrape or extract data from the Platform</li>
            <li>Share your login credentials with unauthorised parties</li>
            <li>Use the Platform in a way that violates any applicable laws of Namibia</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Ownership</h2>
          <p className="text-gray-700 leading-relaxed mb-3">You retain ownership of all data you enter into the Platform. We do not claim ownership of your content. However, you grant us a limited licence to process, store, and display your data solely for the purpose of providing the Platform&apos;s services to you.</p>
          <p className="text-gray-700 leading-relaxed">You are responsible for ensuring you have the right to enter any data into the Platform, including customer information, employee records, and financial data.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. AI Features</h2>
          <p className="text-gray-700 leading-relaxed mb-3">The Platform includes AI-powered features for analytics, route planning, maintenance recommendations, and financial analysis. These features are provided as decision-support tools only. You acknowledge that:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>AI recommendations are not guaranteed to be accurate</li>
            <li>You are responsible for verifying and validating any AI-generated outputs</li>
            <li>We are not liable for decisions made based on AI recommendations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Service Availability</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We strive to maintain high availability of the Platform but do not guarantee uninterrupted access. We may temporarily suspend access for maintenance, updates, or emergency repairs. We will endeavour to provide advance notice of planned downtime.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Fees and Payment</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Access to the Platform may be subject to subscription fees as outlined in your service agreement. We reserve the right to modify our pricing with reasonable notice. Failure to pay applicable fees may result in suspension of your account.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-3">To the maximum extent permitted by Namibian law:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>The Platform is provided &quot;as is&quot; without warranties of any kind</li>
            <li>We are not liable for any indirect, incidental, or consequential damages</li>
            <li>Our total liability shall not exceed the fees paid by you in the 12 months preceding the claim</li>
            <li>We are not responsible for data loss resulting from your actions or third-party services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">The Platform, its design, features, code, and branding are the intellectual property of Infinity Logistics (Pty) Ltd. You may not copy, modify, distribute, or create derivative works based on the Platform without our written consent.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Termination</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Either party may terminate this agreement at any time. Upon termination:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>Your access to the Platform will be revoked</li>
            <li>You may request a copy of your data within 30 days</li>
            <li>After 30 days, your data will be permanently deleted</li>
            <li>Any outstanding fees remain due</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">13. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">These Terms are governed by the laws of the Republic of Namibia. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Namibia.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">14. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">15. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-3">If you have any questions about these Terms, please contact us:</p>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
            <p className="font-semibold">Infinity Logistics (Pty) Ltd</p>
            <p>Windhoek, Namibia</p>
            <p>Email: <a href="mailto:info@logisticvisions.com" className="text-blue-600 hover:underline">info@logisticvisions.com</a></p>
            <p>Website: <a href="https://www.logisticvisions.com" className="text-blue-600 hover:underline">www.logisticvisions.com</a></p>
          </div>
        </section>
      </article>

      <footer className="bg-gray-100 border-t py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Infinity Logistics (Pty) Ltd. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/" className="hover:underline">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
