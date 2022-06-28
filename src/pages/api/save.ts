import { webcrypto } from "crypto";

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

const crypto = webcrypto as unknown as Crypto;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.status(405).end("Method not allowed");
		return;
	}

	const client = createClient({
		url: process.env.REDIS_URL
	});
	await client.connect();

	const { embed } = req.body;

	if (!embed) {
		res.status(400).json({ error: "Missing embed" });
		return;
	}

	const value = JSON.stringify(embed);

	if (value.length > 20000) {
		res.status(400).json({ error: "Embed too large" });
		return;
	}

	const id = Buffer.from(crypto.getRandomValues(new Uint8Array(6)))
		.toString("base64")
		.replaceAll("/", "")
		.replaceAll("+", "")
		.replaceAll("=", "");

	await client.set(id, value, {
		EX: 60 * 60 * 24 * 7
	});

	res.status(200).json({ id });
}
