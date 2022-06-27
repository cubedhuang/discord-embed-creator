/**
 * Represents a Discord message embed.
 */
export interface Embed {
	/**
	 * Embed title.
	 */
	title: string;
	/**
	 * Embed description.
	 */
	description: string;
	/**
	 * Embed URL.
	 */
	url: string;
	/**
	 * Embed timestamp in epoch time.
	 */
	timestamp?: number;
	/**
	 * Embed color.
	 */
	color?: string;
	/**
	 * Embed image URL.
	 */
	image: string;
	/**
	 * Embed thumbnail URL.
	 */
	thumbnail: string;
	/**
	 * Embed footer object.
	 */
	footer: EmbedFooter;
	/**
	 * Embed author object.
	 */
	author: EmbedAuthor;
	/**
	 * Embed fields array.
	 */
	fields: EmbedField[];
}

export interface EmbedFooter {
	/**
	 * Embed footer text.
	 */
	text: string;
	/**
	 * Embed footer icon URL.
	 */
	iconUrl: string;
}

export interface EmbedAuthor {
	/**
	 * Embed author name.
	 */
	name: string;
	/**
	 * Embed author URL.
	 */
	url: string;
	/**
	 * Embed author icon URL.
	 */
	iconUrl: string;
}

export interface EmbedField {
	/**
	 * Embed field name.
	 */
	name: string;
	/**
	 * Embed field value.
	 */
	value: string;
	/**
	 * Embed field inline flag.
	 */
	inline: boolean;
}
