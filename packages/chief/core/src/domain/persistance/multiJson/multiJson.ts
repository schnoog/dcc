import type * as Types from "@kilcekru/dcc-shared-types";
import { z } from "zod";

import { read, remove, stringify, write } from "../utils";

export class MultiJson<ItemSchema extends BaseItemSchema, SynopsisSchema extends BaseSynopsisSchema> {
	#options: MultiJsonOptions<ItemSchema, SynopsisSchema>;

	public constructor(options: MultiJsonOptions<ItemSchema, SynopsisSchema>) {
		nameSchema.parse(options.name);
		this.#options = options;
	}

	public async list(): Promise<Record<string, z.infer<SynopsisSchema>>> {
		const fileContent = await read({
			namespace: "multi",
			fileName: `${this.#options.name}.json`,
			ignoreError: true,
		});
		if (fileContent == undefined) {
			return {};
		}

		const versionSchema = z.object({
			version: z.number(),
		});

		const schema = z.object({
			version: z.number(),
			items: z.record(this.#options.schema.synopsis),
			// items: z.record(z.object({ version: z.number() })),
		});

		const fileContentJson = JSON.parse(fileContent) as unknown;
		const versionResult = versionSchema.safeParse(fileContentJson);

		if (!versionResult.success) {
			// eslint-disable-next-line no-console
			console.error("Invalid Meta File");
			throw versionResult.error;
		}

		if (versionResult.data.version !== this.#options.version) {
			// eslint-disable-next-line no-console
			console.warn("Meta File Version Mismatch");
			return {};
		}

		return schema.parse(fileContentJson).items;
	}

	public async get(id: string) {
		const parsedId = idSchema.parse(id);
		const data: unknown = JSON.parse(
			await read({
				namespace: "multi",
				fileName: `${this.#options.name}/${parsedId}.json`,
			}),
		);
		return data as Types.Campaign.WorkerState; // TODO this.#options.schema.item.parse(data) as z.infer<ItemSchema>;
	}

	public async put(item: z.infer<ItemSchema>) {
		const parsedIdResult = idSchema.safeParse(item.id);
		// const parsedItem = this.#options.schema.item.parse(item);

		if (!parsedIdResult.success) {
			// eslint-disable-next-line no-console
			console.error("Invalid Item Id", item.id);
			throw parsedIdResult.error;
		}

		const parsedId = parsedIdResult.data;

		await write({
			namespace: "multi",
			fileName: `${this.#options.name}/${parsedId}.json`,
			data: stringify(item), // TODO use parsedItem
		});
		const synopsisResult = this.#options.schema.synopsis.safeParse(this.#options.getSynopsis(item));

		if (synopsisResult.success) {
			await this.#updateList(parsedId, synopsisResult.data);
		} else {
			// eslint-disable-next-line no-console
			console.error("Invalid Synopsis", this.#options.getSynopsis(item));
			// eslint-disable-next-line no-console
			console.error(synopsisResult.error.errors);
		}
	}

	public async remove(id: string) {
		const parsedId = idSchema.parse(id);
		await this.#updateList(parsedId, undefined);
		await remove({
			namespace: "multi",
			fileName: `${this.#options.name}/${parsedId}.json`,
		});
	}

	async #updateList(id: string, synopsis: z.infer<SynopsisSchema> | undefined) {
		const list = await this.list();
		if (synopsis == undefined) {
			delete list[id];
		} else {
			list[id] = synopsis;
		}
		await write({
			namespace: "multi",
			fileName: `${this.#options.name}.json`,
			data: stringify({ version: this.#options.version, items: list }),
		});
	}
}

interface MultiJsonOptions<ItemSchema extends BaseItemSchema, SynopsisSchema extends BaseSynopsisSchema> {
	name: string;
	version: number;
	schema: {
		item: ItemSchema;
		synopsis: SynopsisSchema;
	};
	getSynopsis: GetSynopsisFn<ItemSchema, SynopsisSchema>;
}

export const idSchema = z
	.string()
	.regex(/^[a-z0-9_-]{1,45}$/i, "id must be 1-45 charcters and only contain 'a-z0-9_-'");
export const nameSchema = z
	.string()
	.regex(/^[/a-z0-9_-]{1,45}$/i, "name must be 1-45 charcters and only contain 'a-z0-9_-'");

type BaseItemSchema = z.ZodObject<{ id: z.ZodString }>;
type BaseSynopsisSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;
type GetSynopsisFn<ItemSchema extends BaseItemSchema, SynopsisSchema extends BaseSynopsisSchema> = (
	item: z.infer<ItemSchema>,
) => z.infer<SynopsisSchema>;
