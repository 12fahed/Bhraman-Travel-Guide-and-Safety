import * as v2 from "firebase-functions/v2";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// import { QdrantClient } from "@qdrant/js-client-rest";
// import { ChromaClient } from "chromadb";

// const client = new ChromaClient();

initializeApp();
const db = getFirestore();

const genAI = new GoogleGenerativeAI("AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4");
// const collection_name = "text-embeddings";
const schema = {
  description: "Schema of a daily multiple-choice question",
  type: SchemaType.OBJECT,
  properties: {
    question: {
      type: SchemaType.STRING,
      description: "The text of the question",
      nullable: false,
    },
    option1: {
      type: SchemaType.STRING,
      description: "First answer option",
      nullable: false,
    },
    option2: {
      type: SchemaType.STRING,
      description: "Second answer option",
      nullable: false,
    },
    option3: {
      type: SchemaType.STRING,
      description: "Third answer option",
      nullable: false,
    },
    option4: {
      type: SchemaType.STRING,
      description: "Fourth answer option",
      nullable: false,
    },
    hint: {
      type: SchemaType.STRING,
      description: "A hint to help the user answer the question",
      nullable: false,
    },
    explanation: {
      type: SchemaType.STRING,
      description: "A detailed explanation for the correct answer",
      nullable: false,
    },
    difficulty: {
      type: SchemaType.STRING,
      description: "The difficulty level of the question",
      nullable: false,
    },
    topic: {
      type: SchemaType.STRING,
      description: "The topic of the question",
      nullable: false,
    },
    correctAnswer: {
      type: SchemaType.STRING,
      description: `The correct answer to the question in form of 
      option1 OR option2 OR option3 OR option4`,
      nullable: false,
    },
  },
  required: [
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "hint",
    "explanation",
    "difficulty",
    "topic",
    "correctAnswer",
  ],
};

// const linkSchema = {
//   type: SchemaType.OBJECT,
//   description: "Schema for an object containing 5 URLs from https://indiankanoon.org/ related to the text",
//   properties: {
//     title1: {
//       type: SchemaType.STRING,
//       description: "The title of the 1st link",
//       nullable: false,
//     },
//     title2: {
//       type: SchemaType.STRING,
//       description: "The title of the 2nd link",
//       nullable: false,
//     },
//     title3: {
//       type: SchemaType.STRING,
//       description: "The title of the 3rd link",
//       nullable: false,
//     },
//     title4: {
//       type: SchemaType.STRING,
//       description: "The title of the 4th link",
//       nullable: false,
//     },
//     title5: {
//       type: SchemaType.STRING,
//       description: "The title of the 5th link",
//       nullable: false,
//     },
//     url1: {
//       type: SchemaType.STRING,
//       description: "The URL of the 1st link",
//       nullable: false,
//     },
//     url2: {
//       type: SchemaType.STRING,
//       description: "The URL of the 2nd link",
//       nullable: false,
//     },
//     url3: {
//       type: SchemaType.STRING,
//       description: "The URL of the 3rd link",
//       nullable: false,
//     },
//     url4: {
//       type: SchemaType.STRING,
//       description: "The URL of the 4th link",
//       nullable: false,
//     },
//     url5: {
//       type: SchemaType.STRING,
//       description: "The URL of the 5th link",
//       nullable: false,
//     }
//   },
//   required: ["title1", "title2", "title3", "title4", "title5", "url1", "url2", "url3", "url4", "url5"]
// };

// const summarySchema = {
//   description: "Schema for an array of summarized texts and referred texts",
//   type: SchemaType.ARRAY,
//   items: {
//     type: SchemaType.OBJECT,
//     properties: {
//       summarizedText: {
//         type: SchemaType.STRING,
//         description: "Summarized text content",
//         nullable: false,
//       },
//       referredText: {
//         type: SchemaType.ARRAY,
//         description: "An array of referred text strings",
//         items: {
//           type: SchemaType.STRING,
//         },
//         nullable: false,
//       },
//       links: {
//         type: SchemaType.ARRAY,
//         description: "An array of links from https://indiankanoon.org/ related to the text",
//         items: {
//           type: SchemaType.STRING,
//         },
//         nullable: false,
//       },
//     },
//     required: ["summarizedText", "referredText"],
//   },
// };

// const embeddingModel = genAI.getGenerativeModel({
//   model: "text-embedding-004",
// });

// const client = new QdrantClient({
//   url: "https://e0efd09c-ae68-488b-9e7b-3c82bed12c30.us-east4-0.gcp.cloud.qdrant.io:6333",
//   apiKey: "D9dA-ZC5TDmZodgzuJ8vb1ivzSQJgknKwrJro7Z2WEm5vNmKR6rLtA",
// });

export const generateQuestion = v2.https.onRequest(
  async (request, response) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    const topics = [
      "HTML",
      "CSS",
      "JavaScript",
      "Java",
      "C",
      "C++",
      "Python",
      "SQL",
      "React",
      "Database Management System",
      "Operating System",
      "Computer Networking",
    ];

    // Randomly select a topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Randomly select a difficulty level
    const difficulties = ["easy", "medium", "hard"];
    const randomDifficultyIndex = Math.floor(
      Math.random() * difficulties.length
    );
    const difficulty = difficulties[randomDifficultyIndex];

    const prompt = `
    Generate a set of multiple-choice questions (MCQs) 
    on the topic "${randomTopic}".
    Ensure the following:
    The question is of "${difficulty} level".
    Each question has four answer choices, with one correct answer 
    and three plausible distractors.
    Provide the correct answer with a detailed 
    explanation for why it is correct.
    Include a variety of question types, such as conceptual questions, 
    code-based examples, and application scenarios.
    Avoid repetition and ensure all questions are concise and clear.
  `;

    try {
      const result = await model.generateContent(prompt);

      // const intermediatary = await embeddingModel.embedContent(prompt);

      // client.upsert(collection_name, {
      //   points: [
      //     {
      //       id: "pointId_"+Math.random(),
      //       payload: { text: prompt },
      //       vector: intermediatary.embedding.values,
      //     },
      //   ],
      // });

      // console.log(intermediatary.embedding.values);

      // client.createCollection(collection_name, {
      //   vectors: { size: 768, distance: "Cosine" },
      // });

      // Parse the generated response into a usable object
      const questionData = JSON.parse(result.response?.text() || "{}");
      // Add metadata fields
      const now = new Date();
      const documentData = {
        ...questionData,
        createdAt: now.toISOString(), // Firestore timestamp
        version: 2, // Initial version
      };

      // Save to Firestore
      const docRef = await db.collection("Questions").add(documentData);

      await docRef.set(documentData);

      response.send({
        message: "Question generated and saved successfully",
        documentId: docRef.id,
        question: documentData,
      });
    } catch (error) {
      response.status(500).send("Error generating questions");
    }
  }
);

export const summarizeText = v2.https.onRequest(async (request, response) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // generationConfig: {
    // responseMimeType: "application/json",
    // responseSchema: linkSchema,
    // },
  });

  const text = request.body.text;
  const prompt = `
    Act like a contract/application notice drafter that replies to the given Notice based on Indian Laws in reply to this based on whichever domain is applicable:
    - Labor Laws
    - Copyright
    - Real Estate Regulation & Development Act
    - GDPR
    - Foreign Trade & Customs Act
    
    Provide links to the Indian Kanoon website at the end.
    
    ${text}
    `;

  try {
    const result = await model.generateContent(prompt);
    const questionData = JSON.parse(result.response?.text() || "{}");
    const now = new Date();
    const documentData = {
      ...questionData,
      createdAt: now.toISOString(), // Firestore timestamp
      version: 2, // Initial version
    };

    // Save to Firestore
    const docRef = await db.collection("Links").add(documentData);

    await docRef.set(documentData);

    response.send({
      message: "Question generated and saved successfully",
      documentId: docRef.id,
      question: documentData,
    });
  } catch (error) {
    response.status(500).send("Error generating questions");
  }
});

export const embedder = v2.https.onRequest(async (request, response) => {
  try {
    // const coll = await client.getCollections();
    // console.log("List of collections:", coll.collections);
    // response.send(coll.collections);
  } catch (error) {
    response.status(500).send("Error embedding text");
  }
});

export const searchEmbedding = v2.https.onRequest(async (request, response) => {
  try {
    // const query = request.body.query;
    // const limit = request.body.limit || 3;
    // const intermediatary = await embeddingModel.embedContent(query);
    // console.log(collection_name)
    // const searchResults=client.search(collection_name, {
    // filter: {
    //     must: [
    //         {
    //             key: "city",
    //             match: {
    //                 value: "London",
    //             },
    //         },
    //     ],
    // },
    //   vector: intermediatary.embedding.values,
    //   limit: limit,
    // });
    // response.send(searchResults)
  } catch (error) {
    response.status(500).send("Error searching embedding text");
  }
});

export const summarize = v2.https.onRequest(async (request, response) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const pdfResp = await fetch(
      "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"
    ).then((response) => response.arrayBuffer());

    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(pdfResp).toString("base64"),
          mimeType: "application/pdf",
        },
      },
      "Explain the TF-score and its significance in the context of the paper.",
    ]);
    console.log(result.response.text());
    // response.send(result.response.text());
  } catch (error) {
    response.status(500).send("Error summarizing text");
  }
});
