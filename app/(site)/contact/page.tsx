import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { T } from "@/components/text";
import { getContact, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { filled } from "@/lib/placeholder";

export async function generateMetadata() {
  const page = await getContact();
  return pageMetadata({ title: "Contact", description: page.intro, path: "/contact" });
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSettings(), getContact()]);
  const email = filled(settings.email);
  const phone = filled(settings.phone);

  const socials = [
    { label: "LinkedIn", href: settings.linkedin, placeholder: "[LinkedIn URL]" },
    { label: "Instagram", href: settings.instagram, placeholder: "[Instagram URL]" },
  ];

  return (
    <>
      <PageHeader eyebrow="Contact" heading={page.heading} intro={page.intro} />

      <section className="container-site grid gap-20 pb-24 md:grid-cols-12 md:gap-10 md:pb-32">
        <div className="space-y-10 md:col-span-4">
          <div>
            <h2 className="eyebrow">Email</h2>
            <p className="mt-4 font-serif text-2xl break-words">
              {email ? (
                <a href={`mailto:${email}`} className="transition-colors hover:text-olive">
                  {email}
                </a>
              ) : (
                <T>{settings.email}</T>
              )}
            </p>
          </div>
          <div>
            <h2 className="eyebrow">Phone</h2>
            <p className="mt-4 font-serif text-2xl">
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="transition-colors hover:text-olive">
                  {phone}
                </a>
              ) : (
                <T>{settings.phone}</T>
              )}
            </p>
          </div>
          <div>
            <h2 className="eyebrow">Based in</h2>
            <p className="mt-4 font-serif text-2xl">
              <T>{settings.location}</T>
            </p>
          </div>
          <div>
            <h2 className="eyebrow">Elsewhere</h2>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-olive decoration-1 underline-offset-4 transition-colors hover:text-olive"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span>
                      {s.label} — <T>{s.placeholder}</T>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <h2 className="sr-only">Send a message</h2>
          <ContactForm email={email} />
        </div>
      </section>
    </>
  );
}
