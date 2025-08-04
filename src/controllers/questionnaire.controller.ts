import { Request, Response } from "express";
import ProtocolDocument from "../models/protocol-document.schema";
import { generateQuestionnairePrompt } from "../constants/prompts";
import openai from "../config/openai";
import Questionnaire from "../models/questionnaire.schema";

async function getEmbedding(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return resp.data[0].embedding;
}

export class QuestionnaireController {
  static async generate(req: Request, res: Response) {
    try {
      const { protocol_id, question } = req.body;
      if (!protocol_id || !question) {
        return res
          .status(400)
          .json({ error: "Missing protocol_id or question" });
      }

      const questionEmbedding = await getEmbedding(question);

      const contextChunks = await ProtocolDocument.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: questionEmbedding,
            numCandidates: 100,
            limit: 10,
            filter: {
              protocol_id: { $eq: protocol_id },
            },
          },
        },
        {
          $project: {
            _id: 0,
            text: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      if (contextChunks.length === 0) {
        return res
          .status(404)
          .json({ error: "No relevant information found for this protocol." });
      }

      const context = contextChunks.map((chunk) => chunk.text).join("\n\n");
      const prompt = generateQuestionnairePrompt(context, question);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.3,
      });

      const answer = completion.choices[0]?.message?.content;

      await Questionnaire.create({
        protocol_id,
        questionnaire: answer,
        protocol_name: "test",
      });

      res.json({ answer });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Failed to generate answer", details: err });
    }
  }

  static async save(req: Request, res: Response) {
    try {
      const { protocol_id, protocol_name, questionnaire } = req.body;
      if (!protocol_id || !protocol_name || !questionnaire) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const saved = await Questionnaire.create({
        protocol_id,
        protocol_name,
        questionnaire,
      });
      res.status(201).json({ success: true, questionnaire: saved });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Failed to save questionnaire", details: err });
    }
  }
}
