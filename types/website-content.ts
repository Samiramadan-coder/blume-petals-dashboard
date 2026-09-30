import z from "zod";

export const homePageSchema = z.object({
  hero: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    description: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    image: z.union([z.url(), z.instanceof(File), z.null()]),
  }),

  categories: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
  }),

  how_it_works: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    items: z.array(
      z.object({
        title: z.object({
          en: z.union([z.string(), z.null()]),
          ar: z.union([z.string(), z.null()]),
        }),
        description: z.object({
          en: z.union([z.string(), z.null()]),
          ar: z.union([z.string(), z.null()]),
        }),
        image: z.union([z.url(), z.instanceof(File), z.null()]),
      }),
    ),
  }),

  bouquet_builder: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    description: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    items: z.array(
      z.object({
        title: z.object({
          en: z.union([z.string(), z.null()]),
          ar: z.union([z.string(), z.null()]),
        }),
        description: z.object({
          en: z.union([z.string(), z.null()]),
          ar: z.union([z.string(), z.null()]),
        }),
        icon: z.union([z.url(), z.instanceof(File), z.null()]),
      }),
    ),
  }),

  shop_the_moment: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
  }),

  our_selection: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
  }),

  real_creations: z.object({
    title: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    subtitle: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
    description: z.object({
      en: z.union([z.string(), z.null()]),
      ar: z.union([z.string(), z.null()]),
    }),
  }),
});

export type HomePage = z.infer<typeof homePageSchema>;
