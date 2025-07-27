import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Morning Buddy',
  description:
    'Learn how Morning Buddy collects, uses, stores, and protects your personal information in line with UK GDPR and the Data Protection Act 2018.',
};

export default function PrivacyPage() {
  const lastUpdated = '27 July 2025'; // keep this in ISO or UK long-form for clarity

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Link
            href="/"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-10">Last updated: {lastUpdated}</p>

          <article className="prose prose-gray max-w-none">
            {/* 1. Who we are */}
            <h2>1. Who we are</h2>
            <p>
              <strong>Morning Buddy Ltd</strong> (<em>we</em>, <em>our</em>, <em>us</em>) is the data
              controller for personal information collected via this website and any associated
              waiting-list forms. We are registered in England and Wales (company no.&nbsp;
              {/* TODO: add company number */}) and with the UK Information Commissioner’s Office
              (ICO registration no.&nbsp;{/* TODO */}). You can reach our Data Protection Lead at&nbsp;
              <a
                href="mailto:privacy@morningbuddy.co.uk"
                className="text-amber-600 hover:text-amber-700"
              >
                privacy@morningbuddy.co.uk
              </a>
              .
            </p>

            {/* 2. What information we collect */}
            <h2>2. Information we collect</h2>
            <h3>a) Information you provide directly</h3>
            <ul>
              <li>Email address (required for the waiting list)</li>
              <li>Name or display-name (optional)</li>
              <li>Marketing and communication preferences</li>
              <li>Any content you submit when contacting us</li>
            </ul>

            <h3>b) Information collected automatically</h3>
            <ul>
              <li>IP address and approximate location</li>
              <li>Device/browser type and version</li>
              <li>Pages visited, time-stamps, referrer URLs, and interaction logs</li>
              <li>Cookie identifiers and similar technologies (see our&nbsp;
                <Link href="/cookie-policy">Cookie Policy</Link>)
              </li>
            </ul>

            {/* 3. Why we collect it / lawful bases */}
            <h2>3. How and why we use your information</h2>
            <p>We process personal data only where a lawful basis under UK GDPR applies:</p>
            <ul>
              <li>
                <strong>Consent&nbsp;</strong>—to send you early-access emails and marketing
                updates about Morning Buddy. You can withdraw consent at any time by clicking
                “unsubscribe” or emailing us.
              </li>
              <li>
                <strong>Legitimate interest&nbsp;</strong>—to administer and improve our site,
                prevent misuse, and secure our services.
              </li>
              <li>
                <strong>Legal obligation&nbsp;</strong>—to comply with tax, accounting, or other
                statutory duties.
              </li>
            </ul>

            {/* 4. Who we share it with */}
            <h2>4. Sharing and disclosure</h2>
            <p>
              We never sell your data. We share it only with trusted third-party processors who
              help us operate this site (<em>e.g.</em> email automation, cloud hosting). Each
              processor is bound by a data-processing agreement. A current list is available on
              request.
            </p>
            <p>
              Personal data may be disclosed to competent authorities if required by law, or in
              connection with legal proceedings.
            </p>

            {/* 5. International transfers */}
            <h2>5. International transfers</h2>
            <p>
              Where our processors are located outside the UK/EEA, transfers are covered by
              adequacy regulations or by Standard Contractual Clauses to ensure an equivalent level
              of protection.
            </p>

            {/* 6. Data retention */}
            <h2>6. Data retention</h2>
            <p>
              We keep waiting-list data until the earlier of: (a) two years after your last
              interaction with us; (b) your request for deletion; or (c) rollout of the production
              service. Server logs are retained for up to 12 months for security auditing.
            </p>

            {/* 7. Your rights */}
            <h2>7. Your data-protection rights</h2>
            <p>You may:</p>
            <ul>
              <li>Request access to the personal data we hold about you</li>
              <li>Ask us to correct or erase that data</li>
              <li>Object to or restrict certain processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time (marketing emails will then stop)</li>
              <li>
                Lodge a complaint with the ICO (<a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 hover:text-amber-700"
                >
                  ico.org.uk
                </a>)
              </li>
            </ul>

            {/* 8. Automated decision-making */}
            <h2>8. Automated decision-making</h2>
            <p>
              We do not use your information to make decisions producing legal or similarly
              significant effects without human review.
            </p>

            {/* 9. Children */}
            <h2>9. Children’s privacy</h2>
            <p>
              Our waiting-list site is not aimed at children under 13. We do not knowingly collect
              their data. If you learn that a child has provided us information, please contact us
              so we can delete it.
            </p>

            {/* 10. Security */}
            <h2>10. How we protect your data</h2>
            <p>
              We use industry-standard HTTPS encryption in transit and AES-256 encryption at rest.
              Access to databases is role-restricted and audited. We review suppliers regularly for
              compliance.
            </p>

            {/* 11. Cookies */}
            <h2>11. Cookies</h2>
            <p>
              Basic cookies are essential for site performance (lawful basis: legitimate interest).
              Non-essential analytics cookies are used only with consent. You can change your cookie
              settings at any time—see our <Link href="/cookie-policy">Cookie Policy</Link> for
              details.
            </p>

            {/* 12. Updates */}
            <h2>12. Changes to this policy</h2>
            <p>
              We may update this notice to reflect changes in the law or our practices. We will post
              the revised version here and, where appropriate, notify you by email.
            </p>

            {/* 13. Contact */}
            <h2>13. Contact us</h2>
            <p>
              Questions, requests, or complaints? Email&nbsp;
              <a
                href="mailto:privacy@morningbuddy.co.uk"
                className="text-amber-600 hover:text-amber-700"
              >
                privacy@morningbuddy.co.uk
              </a>{' '}
              or write to Morning Buddy Ltd, {/* TODO: insert trading address */}, United Kingdom.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}