import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    iconName: z.string().optional(),
    description: z.string(),
    fullDescription: z.string().optional(),
    featured: z.boolean().default(false),
    badge: z.string().optional(),
    lastUpdated: z.string().optional(),

    image: z.string(),
    galleryImages: z.array(z.string()).optional(),
    detailImage: z.string().optional(),
    beforeAfter: z
      .object({
        before: z.string(),
        after: z.string(),
      })
      .optional(),

    pricing: z
      .object({
        from: z.number().optional(),
        to: z.number().optional(),
        currency: z.string().default('$'),
        unit: z.string().optional(),
        note: z.string().optional(),
        tiers: z
          .array(
            z.object({
              label: z.string(),
              price: z.number(),
              popular: z.boolean().optional(),
              features: z.array(z.string()).optional(),
            })
          )
          .optional(),
      })
      .optional(),

    features: z.array(z.string()),

    process: z
      .array(
        z.object({
          step: z.number(),
          title: z.string(),
          description: z.string(),
          iconName: z.string().optional(),
        })
      )
      .optional(),

    whyChooseUs: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          iconName: z.string().optional(),
        })
      )
      .optional(),

    testimonials: z
      .array(
        z.object({
          name: z.string(),
          text: z.string(),
          rating: z.number().optional(),
          location: z.string().optional(),
        })
      )
      .optional(),

    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    relatedServices: z.array(z.string()).optional(),
    h1Title: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    entities: z.array(z.string()).optional(),
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string(),

    parentType: z.enum(['hub', 'homepage', 'family']),
    parentSlug: z.string().nullable(),
    type: z.enum(['informational', 'decision_support']),
    angle: z.enum([
      'definition',
      'qualifier',
      'concern',
      'process',
      'frequency',
      'scenario',
      'comparison',
      'cost',
      'what-to-expect',
      'decision-stage',
      'faq',
    ]),
    stage: z.enum(['informational', 'decision']),

    targetKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).default([]),
    metaTitle: z.string(),
    metaDescription: z.string(),

    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readingTimeMin: z.number().optional(),
    wordCountTarget: z.number().optional(),

    image: z.string(),
    imageAlt: z.string(),
    contentImages: z
      .array(
        z.union([
          z.string(),
          z.object({ url: z.string(), alt: z.string().optional(), role: z.string().optional() }),
        ])
      )
      .min(1),

    internalLinksOut: z
      .array(
        z.object({
          targetSlug: z.string(),
          targetType: z.enum(['hub', 'support', 'page', 'family', 'homepage']),
          anchorHint: z.string().optional(),
        })
      )
      .optional(),

    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = {
  services: servicesCollection,
  guides: guidesCollection,
};
