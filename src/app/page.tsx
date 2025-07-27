import { Header, Hero, Callout, SocialProof, Faq, Footer } from "@/components";

// Enable static generation for optimal performance
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Callout />
        <SocialProof />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
