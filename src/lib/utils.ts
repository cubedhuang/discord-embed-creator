import type { Embed } from "./interfaces";

export function embedToJson(embed: Embed): string {
	return JSON.stringify(clearObjectEmpty(embed), null, 2);
}

function clearObjectEmpty<T extends object>(obj: T): Partial<T> {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		// @ts-expect-error
		return obj.map(clearObjectEmpty);
	}

	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (typeof value === "object") {
			// @ts-expect-error
			acc[key] = clearObjectEmpty(value);
		} else if (value) {
			// @ts-expect-error
			acc[key] = value;
		}
		return acc;
	}, {});
}
