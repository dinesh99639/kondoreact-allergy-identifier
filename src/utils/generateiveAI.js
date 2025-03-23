import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });


export const extractData = async (imageAsBase64, mime, ailmentsList) => {
  // const ailments = generateStringFromObject(ailmentsList);

  const prompt = `
Based on the provided image, evaluate whether this product is safe for the user or users. Respond with a JSON object as mentioned
Input JSON: ${JSON.stringify(ailmentsList)}
Output JSON Format:
{
  <id>: {
    "consumable": <true or false>,
    "ailments" : <an object where each ailment is a key, and its value is true if incompatible with the product, or false if compatible>,
    "reason" : <a brief explanation (under 50 words) as to why the product is not consumable>
  }
}

Instructions:
- Don't add extra words like ticks, quotes, or json in the response.
- Please send only json respose and follow strict JSON format.
- In the given JSON format, one user is added as an example. The relationship can be many ids to one entity.
- Provide reason for every result in easy to understand sentance. The reason should not contain already known data.
- Be little sarcastic but always use formal tone.
- Include smily emojis whereever possible to make the user feel more attracted.
`;

  const image = {
    inlineData: {
      data: imageAsBase64,
      mimeType: `image/${mime}`,
    },
  };

  const result = await model.generateContent([prompt, image]);
  const text = result.response.candidates[0].content.parts[0].text;
  const cleanedResponse = text
    .replace(/```json\n|\n```/g, '')
    .replace(/\\n/g, '')
    .replace(/\\"/g, '"');

  return JSON.parse(cleanedResponse);
};
