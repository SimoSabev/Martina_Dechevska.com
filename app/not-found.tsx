import type { Metadata } from "next";
import { ArrowLink } from "@/components/arrow-link";
import SiteLayout from "./(site)/layout";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="container-site py-32 md:py-44">
      <p className="eyebrow">404</p>
      <h1 className="mt-8 font-serif text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95]">
        This page has <span className="italic">moved on.</span>
      </h1>
      <div className="mt-12">
        <ArrowLink href="/">Return home</ArrowLink>
      </div>
      </section>
    </SiteLayout>
  );
}
