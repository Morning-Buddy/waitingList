import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Morning Buddy',
  description:
    'The legal agreement governing your use of Morning Buddy, the Buddy Store, and related subscription services.',
};

export default function TermsPage() {
  const lastUpdated = '27 July 2025'; // keep current

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

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-10">Last updated: {lastUpdated}</p>

          <article className="prose prose-gray max-w-none">
            {/* 1. Introduction */}
            <h2>1. Who we are and how these Terms work</h2>
            <p>
              <strong>Morning Buddy Ltd</strong> (<em>we</em>, <em>our</em>, <em>us</em>) is a company
              registered in England and Wales (no.&nbsp;{/* TODO */}). These Terms of Service
              (<strong>Terms</strong>) form a legally binding agreement between Morning Buddy Ltd
              and you (<strong>you</strong>, <strong>your</strong>). By creating an account,
              joining the waiting list, purchasing a subscription, or buying a Buddy in the Buddy
              Store, you confirm that you accept these Terms.
            </p>

            {/* 2. Eligibility */}
            <h2>2. Eligibility</h2>
            <p>
              You must be at least 13 years old (or the minimum digital-consent age in your country,
              whichever is higher) to use the Service. If you are under 18, you represent that your
              parent or legal guardian has reviewed and agreed to these Terms on your behalf.
            </p>

            {/* 3. The Service */}
            <h2>3. Description of the Service</h2>
            <p>
              Morning Buddy is an AI-powered wake-up and routine-building application. Features
              include:
            </p>
            <ul>
              <li>The Morning Buddy mobile/web app (currently in closed beta)</li>
              <li>The Buddy + subscription plan</li>
              <li>The Buddy Store marketplace for user-generated digital “Buddies”</li>
              <li>Associated websites, APIs, and support channels</li>
            </ul>
            <p>
              The beta Service is provided <em>as-is</em>. Functionality may change or be withdrawn
              at any time.
            </p>

            {/* 4. Accounts */}
            <h2>4. Accounts and security</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate information during sign-up and keep it up to date</li>
              <li>Keep your password confidential and secure</li>
              <li>Notify us immediately of any unauthorised use or security breach</li>
            </ul>

            {/* 5. The Buddy Store & UGC */}
            <h2>5. Buddy Store and user-generated content</h2>
            <p>
              The Buddy Store allows users to create, list, buy, and sell digital voice
              personalities (<em>Buddies</em>). You retain ownership of Buddies you create but grant
              us a worldwide, royalty-free licence to host, reproduce, distribute, and promote them
              within the Service. You are responsible for ensuring that your Buddies:
            </p>
            <ul>
              <li>Do not infringe third-party IP or publicity rights</li>
              <li>Comply with applicable laws (including voice-clone consent)</li>
              <li>Contain no unlawful, hateful, or sexually explicit material</li>
            </ul>
            <p>
              We may remove or suspend any Buddy at our sole discretion to comply with law or
              protect users.
            </p>

            {/* 6. Acceptable use */}
            <h2>6. Acceptable use</h2>
            <p>You must not:</p>
            <ul>
              <li>Break the law or encourage others to do so</li>
              <li>Upload viruses, malware, or attempt to gain unauthorised access</li>
              <li>Reverse-engineer or copy the Service or its AI models</li>
              <li>Use the Service to harass or defame anyone</li>
            </ul>

            {/* 7. Subscriptions & payments */}
            <h2>7. Subscriptions, Buddy purchases, and payments</h2>
            <h3>a) Buddy + subscription</h3>
            <p>
              Buddy + costs £2.99 per month and renews automatically every month until cancelled.
              We use {/* TODO: e.g. Stripe Payments UK Ltd */} (<em>Payment Processor</em>) to handle
              card details—none are stored on our servers. You can cancel at any time in your
              account dashboard or via your app-store subscription settings. Cancellation prevents
              the next renewal; no partial refunds for the current billing period are provided
              unless required by law.
            </p>
            <h3>b) Buddy Store purchases</h3>
            <p>
              Buddies are digital content delivered immediately after payment. By purchasing a
              Buddy, you expressly consent to immediate performance and acknowledge that your
              statutory 14-day “cooling-off” right is lost once the download/streaming begins
              (Consumer Contracts Regulations 2013, reg. 37).
            </p>
            <h3>c) Creator payouts</h3>
            <p>
              Creators earn 70 % of the net sale price. Payouts are made monthly via the Payment
              Processor subject to KYC checks and a £10 minimum threshold.
            </p>

            {/* 8. Statutory rights */}
            <h2>8. Your statutory rights—digital content</h2>
            <p>
              Under the Consumer Rights Act 2015, digital content must be of satisfactory quality,
              fit for purpose, and as described. If it is faulty, you are entitled to a repair,
              replacement, or refund.
            </p>

            {/* 9. Disclaimers */}
            <h2>9. Disclaimers and AI limitations</h2>
            <p>
              All wake-up advice and motivational scripts are generated by AI and are provided for
              informational purposes only. They do not constitute medical or professional advice.
              You use the Service at your own risk.
            </p>

            {/* 10. Limitation of liability */}
            <h2>10. Limitation of liability</h2>
            <p>
              Nothing in these Terms limits liability for death or personal injury caused by
              negligence, fraud, or any liability that cannot be excluded under law. Subject to
              that, our total aggregate liability is limited to the greater of (i) £30 or
              (ii) the total fees you paid to us in the 12 months preceding the claim.
            </p>

            {/* 11. Indemnity */}
            <h2>11. Indemnity</h2>
            <p>
              You agree to indemnify Morning Buddy Ltd against any losses, costs, or claims arising
              from your breach of these Terms or misuse of the Service.
            </p>

            {/* 12. Termination */}
            <h2>12. Termination and suspension</h2>
            <p>
              We may suspend or terminate your account immediately if you breach these Terms or if
              required by law. You can close your account at any time by emailing&nbsp;
              <a
                href="mailto:legal@morningbuddy.co.uk"
                className="text-amber-600 hover:text-amber-700"
              >
                legal@morningbuddy.co.uk
              </a>
              .
            </p>

            {/* 13. Complaints & ADR */}
            <h2>13. Complaints and dispute resolution</h2>
            <p>
              We aim to resolve complaints within 30 days. Email&nbsp;
              <a
                href="mailto:support@morningbuddy.co.uk"
                className="text-amber-600 hover:text-amber-700"
              >
                support@morningbuddy.co.uk
              </a>
              . If a dispute cannot be resolved, you may refer it to&nbsp;
              {/* TODO: ADR entity name, e.g. “Consumer Arbitration Service” */} for independent
              alternative dispute resolution. Online purchasers may also use the EU ODR platform.
            </p>

            {/* 14. Governing law */}
            <h2>14. Governing law and jurisdiction</h2>
            <p>
              These Terms and any dispute arising out of them are governed by the laws of England
              and Wales. The courts of England and Wales have exclusive jurisdiction.
            </p>

            {/* 15. Miscellaneous */}
            <h2>15. Miscellaneous</h2>
            <ul>
              <li><strong>Severability </strong>—If any provision is unenforceable, the remainder stays in force.</li>
              <li><strong>No waiver </strong>—Failure to enforce a right is not a waiver of that right.</li>
              <li><strong>Assignment </strong>—We may transfer our rights/obligations; you may not without consent.</li>
              <li><strong>Entire agreement </strong>—These Terms (plus referenced policies) are the whole contract between us.</li>
            </ul>

            {/* 16. Changes */}
            <h2>16. Changes to these Terms</h2>
            <p>
              We may update these Terms to reflect legal or operational changes. We will give at
              least 14 days’ notice by email or in-app before material changes take effect. Your
              continued use after that date constitutes acceptance.
            </p>

            {/* 17. Contact */}
            <h2>17. Contact us</h2>
            <p>
              Legal queries: <a
                href="mailto:legal@morningbuddy.co.uk"
                className="text-amber-600 hover:text-amber-700"
              >
                legal@morningbuddy.co.uk
              </a>
              <br />
              Postal: Morning Buddy Ltd, {/* TODO: trading address */}, United Kingdom.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}