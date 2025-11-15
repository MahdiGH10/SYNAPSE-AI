import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import DemoPreview from '@/components/landing/DemoPreview';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Newsletter from '@/components/landing/Newsletter';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <DemoPreview />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </Layout>
  );
}

