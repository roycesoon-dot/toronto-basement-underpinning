declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"guides": {
"architectural-drawings-basement-underpinning.mdx": {
	id: "architectural-drawings-basement-underpinning.mdx";
  slug: "architectural-drawings-basement-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"basement-ceiling-height-requirements.mdx": {
	id: "basement-ceiling-height-requirements.mdx";
  slug: "basement-ceiling-height-requirements";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"basement-finishing-after-underpinning.mdx": {
	id: "basement-finishing-after-underpinning.mdx";
  slug: "basement-finishing-after-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"basement-finishing-cost-ontario.mdx": {
	id: "basement-finishing-cost-ontario.mdx";
  slug: "basement-finishing-cost-ontario";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"basement-finishing-process-timeline.mdx": {
	id: "basement-finishing-process-timeline.mdx";
  slug: "basement-finishing-process-timeline";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"basement-underpinning-cost-ontario.mdx": {
	id: "basement-underpinning-cost-ontario.mdx";
  slug: "basement-underpinning-cost-ontario";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"basement-underpinning-process.mdx": {
	id: "basement-underpinning-process.mdx";
  slug: "basement-underpinning-process";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"battery-backup-sump-pumps-explained.mdx": {
	id: "battery-backup-sump-pumps-explained.mdx";
  slug: "battery-backup-sump-pumps-explained";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"city-of-toronto-building-permit-basement-underpinning.mdx": {
	id: "city-of-toronto-building-permit-basement-underpinning.mdx";
  slug: "city-of-toronto-building-permit-basement-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"foundation-crack-repair-vs-underpinning.mdx": {
	id: "foundation-crack-repair-vs-underpinning.mdx";
  slug: "foundation-crack-repair-vs-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"foundation-cracks-that-need-repair.mdx": {
	id: "foundation-cracks-that-need-repair.mdx";
  slug: "foundation-cracks-that-need-repair";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"foundation-repair-cost-ontario.mdx": {
	id: "foundation-repair-cost-ontario.mdx";
  slug: "foundation-repair-cost-ontario";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"how-long-does-basement-waterproofing-last.mdx": {
	id: "how-long-does-basement-waterproofing-last.mdx";
  slug: "how-long-does-basement-waterproofing-last";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"how-to-choose-basement-underpinning-contractor-toronto.mdx": {
	id: "how-to-choose-basement-underpinning-contractor-toronto.mdx";
  slug: "how-to-choose-basement-underpinning-contractor-toronto";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"interior-basement-waterproofing-cost-ontario.mdx": {
	id: "interior-basement-waterproofing-cost-ontario.mdx";
  slug: "interior-basement-waterproofing-cost-ontario";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"interior-vs-exterior-basement-waterproofing.mdx": {
	id: "interior-vs-exterior-basement-waterproofing.mdx";
  slug: "interior-vs-exterior-basement-waterproofing";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"interior-waterproofing-process.mdx": {
	id: "interior-waterproofing-process.mdx";
  slug: "interior-waterproofing-process";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"is-basement-underpinning-safe.mdx": {
	id: "is-basement-underpinning-safe.mdx";
  slug: "is-basement-underpinning-safe";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"legal-basement-apartment-requirements-toronto.mdx": {
	id: "legal-basement-apartment-requirements-toronto.mdx";
  slug: "legal-basement-apartment-requirements-toronto";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"signs-basement-needs-waterproofing.mdx": {
	id: "signs-basement-needs-waterproofing.mdx";
  slug: "signs-basement-needs-waterproofing";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"signs-sump-pump-needs-replacement.mdx": {
	id: "signs-sump-pump-needs-replacement.mdx";
  slug: "signs-sump-pump-needs-replacement";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"signs-you-need-basement-underpinning.mdx": {
	id: "signs-you-need-basement-underpinning.mdx";
  slug: "signs-you-need-basement-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"toronto-basement-flooding-subsidy.mdx": {
	id: "toronto-basement-flooding-subsidy.mdx";
  slug: "toronto-basement-flooding-subsidy";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"underground-plumbing-during-underpinning.mdx": {
	id: "underground-plumbing-during-underpinning.mdx";
  slug: "underground-plumbing-during-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"underpinning-legal-basement-apartment-toronto.mdx": {
	id: "underpinning-legal-basement-apartment-toronto.mdx";
  slug: "underpinning-legal-basement-apartment-toronto";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"underpinning-semi-detached-toronto.mdx": {
	id: "underpinning-semi-detached-toronto.mdx";
  slug: "underpinning-semi-detached-toronto";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"underpinning-vs-bench-footing.mdx": {
	id: "underpinning-vs-bench-footing.mdx";
  slug: "underpinning-vs-bench-footing";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"waterproofing-during-underpinning.mdx": {
	id: "waterproofing-during-underpinning.mdx";
  slug: "waterproofing-during-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"what-is-basement-underpinning.mdx": {
	id: "what-is-basement-underpinning.mdx";
  slug: "what-is-basement-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
"what-to-expect-basement-underpinning.mdx": {
	id: "what-to-expect-basement-underpinning.mdx";
  slug: "what-to-expect-basement-underpinning";
  body: string;
  collection: "guides";
  data: InferEntrySchema<"guides">
} & { render(): Render[".mdx"] };
};
"services": {
"basement-finishing.mdx": {
	id: "basement-finishing.mdx";
  slug: "basement-finishing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"concrete-foundation-repair.mdx": {
	id: "concrete-foundation-repair.mdx";
  slug: "concrete-foundation-repair";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"drawings-permits.mdx": {
	id: "drawings-permits.mdx";
  slug: "drawings-permits";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"interior-waterproofing.mdx": {
	id: "interior-waterproofing.mdx";
  slug: "interior-waterproofing";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"plumbing-drain-services.mdx": {
	id: "plumbing-drain-services.mdx";
  slug: "plumbing-drain-services";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"sump-pumps.mdx": {
	id: "sump-pumps.mdx";
  slug: "sump-pumps";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
