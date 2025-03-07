import { OpenAI } from "openai";

// Get the API key from the electron store
const getApiKey = async () => {
  try {
    const settings = await window.api.getSettings();
    return settings.apiKeys?.openai;
  } catch (error) {
    console.error("Failed to get API key:", error);
    return null;
  }
};

// Generate a breakdown of a todo item
export const generateTodoBreakdown = async (todoText, level = 3) => {
  const apiKey = await getApiKey();

  if (!apiKey) {
    throw new Error(
      "OpenAI API key is not set. Please add it in the settings."
    );
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // For client-side usage
    });

    const prompt = `
      Break down the following todo item into ${level} smaller, actionable steps:
      
      "${todoText}"
      
      The breakdown should:
      - Be specific and actionable
      - Include ${level} steps (more if the task is complex, fewer if it's simple)
      - Be concise but clear
      - Be in a logical sequence
      
      Return ONLY the list of steps, one per line, with no numbering or bullets.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that breaks down tasks into smaller, actionable steps.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content.trim();

    // Split the content into lines and clean up
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("-") && !line.match(/^\d+\./)) // Remove any bullets or numbers
      .filter((line, index, self) => self.indexOf(line) === index); // Remove duplicates
  } catch (error) {
    console.error("Error generating todo breakdown:", error);
    throw error;
  }
};
