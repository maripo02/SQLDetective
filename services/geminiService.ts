

import { GoogleGenAI, Type } from "@google/genai";
import type { Case, Language } from '../types';


if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const caseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy, noir-style title for the murder case." },
        story: { type: Type.STRING, description: "A detailed backstory of the murder. It should be intriguing and provide subtle clues that point towards the killer when combined with database table info." },
        resolution: { type: Type.STRING, description: "A concluding paragraph explaining how the clues led to the identified killer, to be shown after the user solves the case." },
        solution: {
            type: Type.OBJECT,
            description: "The correct solution to the case.",
            properties: {
                killer: { type: Type.STRING, description: "The full name of the killer. This name must exist in the 'suspects' table." },
            },
            required: ["killer"]
        },
        tables: {
            type: Type.ARRAY,
            description: "An array of database tables relevant to the case.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the table (e.g., 'suspects', 'interviews')." },
                    description: { type: Type.STRING, description: "A brief description of what the table contains." },
                    schema: {
                        type: Type.OBJECT,
                        description: "A key-value map of column name to data type (e.g., 'name': 'string', 'age': 'integer'). The keys are the column names and values are their SQL data types.",
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            age: { type: Type.STRING },
                            date: { type: Type.STRING },
                            description: { type: Type.STRING },
                            transcript: { type: Type.STRING },
                            killer: { type: Type.STRING },
                            occupation: { type: Type.STRING },
                            relationship_to_victim: { type: Type.STRING },
                            location: { type: Type.STRING },
                        }
                    },
                    data: {
                        type: Type.ARRAY,
                        description: "An array of objects, where each object is a row in the table.",
                        items: {
                            type: Type.OBJECT,
                            description: "An object representing a single row. The actual keys will correspond to the 'schema' definition for this table.",
                            properties: {
                                id: { type: Type.INTEGER },
                                name: { type: Type.STRING },
                                age: { type: Type.INTEGER },
                                occupation: { type: Type.STRING },
                                relationship_to_victim: { type: Type.STRING },
                                date: { type: Type.STRING },
                                location: { type: Type.STRING },
                                description: { type: Type.STRING },
                                transcript: { type: Type.STRING },
                                killer: { type: Type.STRING },
                            }
                        }
                    }
                },
                required: ["name", "description", "schema", "data"]
            }
        }
    },
    required: ["title", "story", "resolution", "solution", "tables"]
};

export const generateMurderCase = async (language: Language): Promise<Case> => {
    const languageInstruction = language === 'es' ? 'Spanish' : 'English';
    
    const prompt = `
    You are a master crime novelist and database designer. Your task is to generate a self-contained murder mystery case that can be solved using SQL queries.

    Provide your response in JSON format, adhering to the provided schema.

    IMPORTANT: The narrative content of the case MUST be in ${languageInstruction}. This includes the 'title', 'story', 'resolution', and table 'description' fields.
    
    CRITICAL: All database table names, column names, and the data values within the tables MUST remain in English to ensure SQL queries work correctly.

    The story must be intriguing, providing subtle clues that can be pieced together by querying the database tables. The tables should contain information that is relevant to solving the case. One of the suspects must be the killer.

    The 'solution' table must start empty. The user's goal is to execute an INSERT statement into this table with the correct killer's name.

    The killer's name must be derivable from the data in the other tables. For example, a witness saw someone with a specific hair color near a location where an item was reported missing, and only one suspect matches that description.

    Generate data for at least these tables:
    - crime_scene_report: Details about the crime scene.
    - suspects: A list of potential suspects with their personal details (must include name, age, occupation, relationship_to_victim).
    - interviews: Transcripts or summaries of interviews with witnesses or suspects. Must contain clues.
    - victims: Information about the victim.
    - solution: An empty table that the user will insert the answer into. The schema must be { "killer": "string" } and the data array must be empty.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: caseSchema,
            },
        });

        const jsonText = response.text;
        const generatedCase = JSON.parse(jsonText) as Case;
        
        const solutionTable = generatedCase.tables.find(t => t.name.toLowerCase() === 'solution');
        if (solutionTable) {
            solutionTable.data = []; // Force data to be empty
            solutionTable.schema = { killer: 'string' }; // Enforce correct schema
        } else {
            generatedCase.tables.push({
                name: 'solution',
                description: 'The table to insert your final answer into. Column: killer.',
                schema: { killer: 'string' },
                data: []
            });
        }

        return generatedCase;

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to generate a new murder case. The AI detective might be on a coffee break.");
    }
};

const translationSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        story: { type: Type.STRING },
        resolution: { type: Type.STRING },
        tables: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["name", "description"]
            }
        }
    },
    required: ["title", "story", "resolution", "tables"]
};

interface TranslatableContent {
    title: string;
    story: string;
    resolution: string;
    tables: { name: string, description: string }[];
}

export const translateCaseContent = async (
    content: TranslatableContent,
    targetLanguage: Language
): Promise<TranslatableContent> => {
    const languageInstruction = targetLanguage === 'es' ? 'Spanish' : 'English';
    const prompt = `
    You are an expert multilingual content localizer. Your task is to translate ONLY the user-facing narrative text within the provided JSON object to ${languageInstruction}.

    Follow these rules precisely:
    1.  **Translate these top-level fields:** \`title\`, \`story\`, \`resolution\`.
    2.  **Translate table descriptions:** Inside the \`tables\` array, for every object, you MUST translate the \`description\` field. This is non-negotiable. For example, if you see \`{"name": "crime_scene_report", "description": "A summary of the findings at the crime scene."}\`, the translated description MUST be included in the output.
    3.  **Do NOT translate identifiers:** NEVER translate table \`name\` fields or any other keys in the JSON structure. They must remain in English.
    4.  **Preserve Structure:** The output JSON must have the exact same structure as the input.

    JSON object to process:
    ${JSON.stringify(content, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });

        const jsonText = response.text;
        return JSON.parse(jsonText) as TranslatableContent;

    } catch (error) {
        console.error("Error translating content from Gemini:", error);
        throw new Error("Failed to translate the case content.");
    }
};

export const translateTableData = async (
    data: Record<string, any>[],
    targetLanguage: Language
): Promise<Record<string, any>[]> => {
    if (!data || data.length === 0) {
        return [];
    }

    const languageInstruction = targetLanguage === 'es' ? 'Spanish' : 'English';
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    const properties = columns.reduce((acc, key) => {
        const valueType = typeof firstRow[key];
        const geminiType = valueType === 'number' ? Type.NUMBER :
                           valueType === 'boolean' ? Type.BOOLEAN :
                           Type.STRING;
        acc[key] = { type: geminiType };
        return acc;
    }, {} as Record<string, { type: Type }>);

    const dynamicSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: properties
        }
    };

    const prompt = `
    You are an expert data translator. Your task is to translate the JSON array provided below into ${languageInstruction}.

    RULES:
    1.  Translate all human-readable string values (like descriptions, transcripts, notes).
    2.  DO NOT translate proper nouns (names of people, specific places), IDs, numbers, dates, or technical identifiers.
    3.  The output MUST be a valid JSON array with the exact same structure and keys as the input. Only the text values should be changed.

    JSON data to translate:
    ${JSON.stringify(data, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dynamicSchema,
            },
        });

        const jsonText = response.text.trim();
        let parsedData = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedData) || parsedData.length !== data.length) {
            console.warn("Translated data structure mismatch. Returning original data.");
            return data;
        }

        return parsedData;

    } catch (error) {
        console.error("Error translating table data from Gemini:", error);
        throw new Error("Failed to translate table data.");
    }
};