import { Header, Hero, InlineSignupForm, Callout, Benefits, SocialProof, Faq, SecurityStatement, Footer } from "@/components";

// Enable static generation for optimal performance
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20" id="main-content">
        <Hero />
        <InlineSignupForm />
        <Callout />
        <Benefits />
        <SocialProof />
        <Faq />
        <SecurityStatement />
      </main>
      <Footer />
    </div>
  );
}
