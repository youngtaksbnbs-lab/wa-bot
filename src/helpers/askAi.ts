import "dotenv/config";
import { Client, Message } from "@open-wa/wa-automate";
import { logWithColor } from "../utils/logger";
import { sendTextMessage } from "../utils/sender";
import getOpenAiClient from "../utils/openai";

/**
 * Sends request to ChatGPT then returns the response.
 * @param {string} prompt The chat prompt.
 */
const generateChat = async (prompt: string) => {
  // Send request to the ChatGPT model API
  try {
    const completion = await getOpenAiClient().chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    // Return only the generated text
    return completion.choices[0].message.content;
  } catch (error) {
    logWithColor.red(error as unknown as string);
  }
};

/**
 * Sends the prompt to the LLM model, then sends the response as a whatsapp chat.
 * @param {Client} client The message received from sender.
 * @param {Message} message The message received from sender.
 */
const askAi = async (client: Client, message: Message) => {
  const splitMessage = message.body.split(" ");
  try {
    const prompt = splitMessage.slice(1).join(" ");
    // Calls generate chat function
    const response = await generateChat(prompt);

    if (response) {
      // Send the response through WhatsApp chat
      await sendTextMessage(client, message.chatId, response!);
    } else {
      await sendTextMessage(client, message.chatId, "AI bought some milk");
    }
  } catch (error) {
    logWithColor.red(error as unknown as string);
  }
};

export default askAi;
