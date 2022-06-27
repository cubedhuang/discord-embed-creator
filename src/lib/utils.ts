import type { Embed } from "./interfaces";

export function embedToJson(embed: Embed): string {
	return JSON.stringify(clearObjectEmpty(embed), null, 2).replace(
		/(\n\s*)"(\w+)":/g,
		"$1$2:"
	);
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
		key = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
		if (typeof value === "object") {
			// @ts-expect-error
			acc[key] = clearObjectEmpty(value);
		} else if (value) {
			// @ts-expect-error
			acc[key] =
				key === "image" || key === "thumbnail" ? { url: value } : value;
		}
		return acc;
	}, {});
}
