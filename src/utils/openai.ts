import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

const getOpenAiClient = (): OpenAI => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set — AI commands are disabled until it's configured."
    );
  }

  if (!openaiClient) {
    openaiClient = new OpenAI();
  }

  return openaiClient;
};

export default getOpenAiClient;
