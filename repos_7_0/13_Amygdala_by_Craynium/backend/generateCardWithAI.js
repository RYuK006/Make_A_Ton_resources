import "dotenv/config";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates a card using CF's AI api.
 * @param {string} text
 * @param {string} attempts Number of attempts tried so far
 * @returns {Promise<{
 *   front: string;
 *   back: string;
 * }[]>}
 */
export default async function generateCardWithAI(text, attempts) {
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who can only output JSON. Only output JSON in the given schema. DO NOT OUTPUT anything other than JSON.",
      },
      {
        role: "user",
        content: `Use this JSON schema:

Card = {'front': str (question or fill-in-the-blank), 'back': str (answer) }
Return: list[Card] (max_length: 3)

Identify useful information from the following text and use it to generate succinct spaced-repetition JSON Cards, following the given schema:

Note that the output array MUST HAVE ONLY THREE Cards. DO NOT GENERATE MORE THAN THREE Cards.

${text}`,
      },
      {
        role: "assistant",
      },
    ],
    model: "llama-3.2-90b-text-preview",
    stop: "```",
  });

  let output = completion.choices[0]?.message.content;

  return output;
}
