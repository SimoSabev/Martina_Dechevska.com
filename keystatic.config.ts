import { collection, config, fields, singleton } from "@keystatic/core";
import { defaultLocale, type Locale } from "./lib/i18n";

/**
 * Keystatic CMS schema. All content is stored as files in this repository
 * under `content/<locale>/`, so there is no database to run or pay for.
 *
 * Local development edits files on disk. In production, set
 * NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO (e.g. "owner/repo") plus the GitHub app
 * secrets (see README) and edits are committed straight to GitHub, which
 * triggers a Vercel redeploy.
 */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined;

const imageField = (label: string, folder: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/images/${folder}`,
    publicPath: `/images/${folder}/`,
  });

const label = (name: string, locale: Locale) =>
  locale === defaultLocale ? name : `${name} (${String(locale).toUpperCase()})`;

function localeSchema(locale: Locale) {
  const root = `content/${locale}`;

  const singletons = {
    settings: singleton({
      label: label("Site settings & contact details", locale),
      path: `${root}/settings`,
      format: { data: "yaml" },
      schema: {
        name: fields.text({ label: "Full name", defaultValue: "Martina Dechevska" }),
        roleLine: fields.text({
          label: "Role line",
          description: "Short line shown under the name, e.g. 'Journalist · Real Estate Broker'.",
        }),
        seoDescription: fields.text({
          label: "Default search description",
          description: "About 150 characters. Used by Google and when links are shared.",
          multiline: true,
        }),
        email: fields.text({ label: "Email address" }),
        phone: fields.text({ label: "Phone number", description: "Format: (555) 123-4567" }),
        location: fields.text({ label: "Based in", description: "City and state, e.g. 'Miami, Florida'." }),
        linkedin: fields.url({ label: "LinkedIn URL" }),
        instagram: fields.url({ label: "Instagram URL" }),
        archiveUrl: fields.url({
          label: "Journalism archive URL",
          defaultValue: "https://flowersinagun.com",
        }),
      },
    }),

    home: singleton({
      label: label("Home page", locale),
      path: `${root}/home`,
      format: { data: "yaml" },
      schema: {
        tagline: fields.text({
          label: "Tagline",
          description: "One-line positioning statement shown in the hero.",
          multiline: true,
        }),
        intro: fields.text({ label: "Hero introduction", multiline: true }),
        portrait: imageField(
          "Portrait",
          "home",
          "Professional photo. Portrait orientation (4:5), at least 1200px wide.",
        ),
        portraitAlt: fields.text({
          label: "Portrait description (alt text)",
          description: "Describe the photo for screen readers.",
        }),
        statement: fields.text({
          label: "Statement",
          description: "Large line under the hero.",
          multiline: true,
        }),
        journalismTitle: fields.text({ label: "Journalism path — title" }),
        journalismText: fields.text({ label: "Journalism path — text", multiline: true }),
        realEstateTitle: fields.text({ label: "Real estate path — title" }),
        realEstateText: fields.text({ label: "Real estate path — text", multiline: true }),
        highlights: fields.array(
          fields.object({
            value: fields.text({ label: "Figure", description: "e.g. '15+'" }),
            label: fields.text({ label: "Label", description: "e.g. 'Years in journalism'" }),
          }),
          {
            label: "Highlights (figures)",
            description: "Optional. Leave empty to hide the section. Only use verifiable numbers.",
            itemLabel: (props) => `${props.fields.value.value} — ${props.fields.label.value}`,
          },
        ),
      },
    }),

    about: singleton({
      label: label("About page", locale),
      path: `${root}/about/`,
      format: { data: "yaml", contentField: "body" },
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        lede: fields.text({ label: "Opening paragraph", multiline: true }),
        portrait: imageField("Photo", "about", "Second photo for the About page (optional)."),
        portraitAlt: fields.text({ label: "Photo description (alt text)" }),
        body: fields.markdoc({ label: "Biography", extension: "md" }),
      },
    }),

    journalism: singleton({
      label: label("Journalism page", locale),
      path: `${root}/journalism`,
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        intro: fields.text({ label: "Introduction", multiline: true }),
        archiveTitle: fields.text({ label: "Archive block — title" }),
        archiveText: fields.text({ label: "Archive block — text", multiline: true }),
        archiveYears: fields.text({ label: "Archive block — years", defaultValue: "2013 – 2016" }),
      },
    }),

    realEstate: singleton({
      label: label("Real estate page", locale),
      path: `${root}/real-estate`,
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        intro: fields.text({ label: "Introduction", multiline: true }),
        services: fields.array(
          fields.object({
            title: fields.text({ label: "Service" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          { label: "Services", itemLabel: (props) => props.fields.title.value },
        ),
        areas: fields.array(fields.text({ label: "Area" }), {
          label: "Areas served",
          itemLabel: (props) => props.value,
        }),
        brokerage: fields.text({ label: "Brokerage name" }),
        brokerageAddress: fields.text({ label: "Brokerage office address", multiline: true }),
        brokeragePhone: fields.text({ label: "Brokerage office phone" }),
        licenseType: fields.text({
          label: "License type",
          description: "Exactly as on the license, e.g. 'Licensed Real Estate Broker'.",
        }),
        licenseState: fields.text({ label: "Licensing state" }),
        licenseNumber: fields.text({ label: "License number" }),
        showEqualHousing: fields.checkbox({
          label: "Show Equal Housing Opportunity notice",
          defaultValue: true,
        }),
        disclosures: fields.text({
          label: "State-required disclosures",
          description: "Paste the exact wording required by the state / brokerage.",
          multiline: true,
        }),
        ctaTitle: fields.text({ label: "Call to action — title" }),
        ctaText: fields.text({ label: "Call to action — text", multiline: true }),
      },
    }),

    contact: singleton({
      label: label("Contact page", locale),
      path: `${root}/contact`,
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Heading", multiline: true }),
        intro: fields.text({ label: "Introduction", multiline: true }),
      },
    }),
  };

  const collections = {
    articles: collection({
      label: label("Articles & publications", locale),
      path: `${root}/articles/*`,
      slugField: "title",
      format: { data: "yaml" },
      columns: ["outlet", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        outlet: fields.text({ label: "Outlet / publication" }),
        date: fields.date({ label: "Publication date" }),
        url: fields.url({ label: "Link to the article" }),
        excerpt: fields.text({ label: "Short summary (optional)", multiline: true }),
        featured: fields.checkbox({
          label: "Featured",
          description: "Featured articles are listed first.",
          defaultValue: false,
        }),
      },
    }),
  };

  return { singletons, collections };
}

/**
 * Only the default locale is registered today. To add a language, build its
 * schema and register it under suffixed keys, e.g.
 *   const bg = localeSchema("bg");
 *   singletons: { ...en.singletons, home_bg: bg.singletons.home, ... }
 * then point `lib/content.ts` at the suffixed keys for that locale.
 */
const en = localeSchema(defaultLocale);

export default config({
  storage: githubRepo ? { kind: "github", repo: githubRepo } : { kind: "local" },
  ui: {
    brand: { name: "Martina Dechevska" },
    navigation: {
      Pages: ["home", "about", "journalism", "realEstate", "contact"],
      Journalism: ["articles"],
      Settings: ["settings"],
    },
  },
  singletons: en.singletons,
  collections: en.collections,
});
