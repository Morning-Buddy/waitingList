import type { Metadata } from "next";
import { Suspense } from "react";
import { Header, Footer } from "@/components";
import ThankYouContent from "./ThankYouContent";

// Enable static generation for thank you page
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Thanks for joining! – Morning Buddy",
  description: "Thank you for joining the Morning Buddy waiting list. Check your inbox to confirm your email address.",
  robots: "noindex, nofollow", // Prevent indexing of thank you page
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense fallback={<div>Loading...</div>}>
          <ThankYouContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
