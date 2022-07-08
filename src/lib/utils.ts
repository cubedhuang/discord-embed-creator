import type { Embed } from "./interfaces";

export function embedToPartial(embed: Embed): Partial<Embed> {
	return clearEmptySlots(embed);
}

export function embedToObjectCode(
	embed: Embed,
	removeKeyQuotes = true
): string {
	const output = JSON.stringify(clearEmptySlots(embed, true), null, 2);
	if (!removeKeyQuotes) return output;
	return output.replace(/(\n\s*)"(\w+)":/g, "$1$2:");
}

function clearEmptySlots<T extends object>(
	obj: T,
	objectCode = false
): Partial<T> {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		// @ts-expect-error
		return obj.map(e => clearEmptySlots(e, objectCode));
	}

	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (objectCode)
			key = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
		if (typeof value === "object") {
			const cleared = clearEmptySlots(value, objectCode);

			if (Object.keys(cleared).length === 0) return acc;

			// @ts-expect-error
			acc[key] = cleared;
		} else if (value) {
			// @ts-expect-error
			acc[key] = objectCode
				? key === "image" || key === "thumbnail"
					? { url: value }
					: value
				: value;
		}
		return acc;
	}, {});
}
