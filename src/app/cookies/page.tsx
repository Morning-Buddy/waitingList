import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Morning Buddy',
  description:
    'How Morning Buddy uses cookies and similar technologies, your choices, and your rights under UK GDPR and PECR.',
};

export default function CookiesPage() {
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

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-600 mb-10">Last updated: {lastUpdated}</p>

          <article className="prose prose-gray max-w-none">
            {/* 1. Intro */}
            <h2>1. What are cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They are
              widely used to make websites work, remember preferences, analyse traffic, and deliver
              advertising. The UK Privacy and Electronic Communications Regulations (PECR) and UK
              GDPR give you rights over how we use cookies.
            </p>

            {/* 2. Our lawful basis & consent */}
            <h2>2. Our lawful basis</h2>
            <p>
              Essential cookies are placed under the lawful basis of&nbsp;
              <strong>legitimate interest</strong> (they are required for the site to function).
              Non-essential cookies (analytics, functional, marketing) are set only with your&nbsp;
              <strong>consent</strong>. You can change or withdraw consent at any time via the
              “Cookie Preferences” link in the footer.
            </p>

            {/* 3. Types */}
            <h2>3. How we use cookies</h2>
            <h3>a) Essential / strictly necessary</h3>
            <p>These enable core functionality such as:</p>
            <ul>
              <li>Sign-up and login security tokens</li>
              <li>Load balancing between servers</li>
              <li>User consent storage (so we remember your choices!)</li>
            </ul>

            <h3>b) Analytics & performance (optional)</h3>
            <p>
              We currently use&nbsp;
              <strong>Plausible Analytics</strong>, which is cookie-free and collects no personal
              data. If we ever introduce a cookie-based analytics tool, we will request consent
              first and list those cookies here.
            </p>

            <h3>c) Functional (optional)</h3>
            <p>
              Remember settings such as language or theme. If disabled, your choices will reset on
              each visit.
            </p>

            <h3>d) Marketing & third-party (optional)</h3>
            <p>
              Not in use on the waiting-list site today. Should we later embed marketing pixels
              (e.g., Meta Pixel, Google Ads) we will update this policy and obtain explicit consent.
            </p>

            {/* 4. Cookie list */}
            <h2>4. Cookies we set</h2>
            <p>
              Below is the current list. Items marked “—” are placeholders—you’ll only see an entry
              once the cookie exists in production.
            </p>
            <ul>
              <li>
                <strong>mb\_session&nbsp;</strong>(Essential) — Session ID to keep you logged in. Expires
                when you close your browser.
              </li>
              <li>
                <strong>cookie\_consent&nbsp;</strong>(Essential) — Saves your consent preferences for 12 months.
              </li>
              <li>
                <strong>TODO\_analytics\_id&nbsp;</strong>(Analytics) — —.
              </li>
            </ul>

            {/* 5. Managing */}
            <h2>5. How to manage cookies</h2>
            <h3>a) Via our site</h3>
            <p>
              Click “Cookie Preferences” at the bottom of any page to review or change your consent
              choices. (We use {/* TODO: Cookie banner/tool name */} to honour your selections.)
            </p>

            <h3>b) Via your browser</h3>
            <p>
              Most browsers let you refuse or delete cookies. The links below explain how:
            </p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy &amp; security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies &amp; site permissions</li>
            </ul>

            {/* 6. Retention */}
            <h2>6. Retention periods</h2>
            <ul>
              <li>Session cookies: deleted when you close your browser.</li>
              <li>Persistent cookies: remain for up to 12 months (or the duration stated above) unless you delete them earlier.</li>
            </ul>

            {/* 7. Impact */}
            <h2>7. Consequences of disabling cookies</h2>
            <p>
              The site will still load, but certain features—e.g., form submission, remembering your
              email on the waiting list—may not work correctly.
            </p>

            {/* 8. Updates */}
            <h2>8. Changes to this policy</h2>
            <p>
              We may update this page to reflect changes in technology or law. Significant changes
              will be sign-posted on the homepage or via email where appropriate.
            </p>

            {/* 9. Contact */}
            <h2>9. Contact us</h2>
            <p>
              Questions or complaints? Email&nbsp;
              <a
                href="mailto:privacy@morningbuddy.co.uk"
                className="text-amber-600 hover:text-amber-700"
              >
                privacy@morningbuddy.co.uk
              </a>{' '}
              or write to Morning Buddy Ltd, {/* TODO: trading address */}, United Kingdom.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}