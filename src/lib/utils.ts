import type { Embed } from "./interfaces";

export function createEmbed(): Embed {
	return {
		title: "",
		description: "",
		url: "",
		color: "",
		image: "",
		thumbnail: "",
		footer: {
			text: "",
			iconUrl: ""
		},
		author: {
			name: "",
			url: "",
			iconUrl: ""
		},
		fields: []
	};
}
