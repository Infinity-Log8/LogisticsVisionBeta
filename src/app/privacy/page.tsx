import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Logistic Visions",
  description: "Privacy Policy for Logistic Visions platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">Logistic Visions</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
          </nav>
        </div>
      </header>
      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 16, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Logistic Visions (&quot;the Platform&quot;) is a logistics management application developed and operated by <strong>Infinity Logistics (Pty) Ltd</strong>, a company registered in the Republic of Namibia (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).</p>
          <p className="text-gray-700 leading-relaxed">This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our Platform. By accessing or using Logistic Visions, you agree to the practices described in this policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We collect the following types of information:</p>
          <h3 className="text-lg font-medium text-gray-800 mb-2">2.1 Account Information</h3>
          <p className="text-gray-700 leading-relaxed mb-3">When you create an account, we collect your name, email address, and organisation details. If you sign in with Google, we receive your Google profile name, email address, and profile picture from Google&apos;s authentication service.</p>
          <h3 className="text-lg font-medium text-gray-800 mb-2">2.2 Operational Data</h3>
          <p className="text-gray-700 leading-relaxed mb-3">Data you enter while using the Platform, including trip records, fleet information, customer details, financial records, employee information, and documents you upload.</p>
          <h3 className="text-lg font-medium text-gray-800 mb-2">2.3 Usage Data</h3>
          <p className="text-gray-700 leading-relaxed">We automatically collect technical data such as your IP address, browser type, device information, pages visited, and timestamps to improve the Platform&apos;s performance and security.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li>Provide, maintain, and improve the Platform</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Process logistics operations (trips, fleet, invoicing, payroll)</li>
            <li>Generate analytics and reports for your organisation</li>
            <li>Provide AI-powered features such as route planning and maintenance recommendations</li>
            <li>Send transactional communications (e.g., invoices, trip updates)</li>
            <li>Ensure the security and integrity of the Platform</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Storage and Security</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Your data is stored securely using Google Firebase infrastructure. We implement industry-standard security measures including encryption in transit (TLS/SSL), encrypted storage, access controls, and regular security monitoring.</p>
          <p className="text-gray-700 leading-relaxed">Our Platform uses a multi-tenant architecture where each organisation&apos;s data is logically isolated from other organisations. Only authorised members of your organisation can access your data.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Sharing</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We do not sell your personal data to third parties. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li><strong>Service Providers:</strong> We use Google Cloud Platform (Firebase) for hosting and data storage, and Google Authentication for sign-in services.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, or legal process under Namibian law.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.</li>
            <li><strong>With Your Consent:</strong> We may share data with third parties when you have given explicit consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Google OAuth and Third-Party Authentication</h2>
          <p className="text-gray-700 leading-relaxed mb-3">When you choose to sign in with Google, we access only the basic profile information (name, email, profile picture) provided by Google&apos;s OAuth 2.0 service. We do not access your Google Drive, Gmail, contacts, or any other Google services.</p>
          <p className="text-gray-700 leading-relaxed">Our use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Correct</strong> inaccurate or incomplete personal data</li>
            <li><strong>Delete</strong> your account and associated data</li>
            <li><strong>Export</strong> your data in a portable format</li>
            <li><strong>Withdraw consent</strong> for data processing at any time</li>
            <li><strong>Object</strong> to processing of your data for specific purposes</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">To exercise any of these rights, please contact us at the details provided below.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">We use essential cookies and local storage to maintain your session, remember your preferences, and ensure the Platform functions correctly. We do not use advertising or third-party tracking cookies.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">We retain your data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (such as financial record-keeping obligations).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Children&apos;s Privacy</h2>
          <p className="text-gray-700 leading-relaxed">Logistic Visions is a business application not intended for use by individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us so we can take appropriate action.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Platform after changes are posted constitutes acceptance of the revised policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-3">If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:</p>
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
