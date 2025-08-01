import { Request, Response } from 'express';
import ProtocolDocument from '../models/protocol-document.schema';
import { generateQuestionnairePrompt } from '../constants/prompts';
import openai from '../config/openai';
import Questionnaire from '../models/questionnaire.schema';

export class QuestionnaireController {
  static async generate(req: Request, res: Response) {
    try {
      const { protocol_id } = req.body;
      if (!protocol_id) {
        return res.status(400).json({ error: 'Missing protocol_id' });
      }
      const protocolDoc = await ProtocolDocument.findOne({ _id: protocol_id });
      if (!protocolDoc) {
        return res.status(404).json({ error: 'Protocol document not found' });
      }
      const chunkTexts = protocolDoc.chunks.map((chunk: any) => chunk.text);
      const context = chunkTexts.slice(0, 10).join('\n');
      const prompt = `${generateQuestionnairePrompt(context)}`;
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600
      });
      const questionnaire = completion.choices[0]?.message?.content;
      await Questionnaire.create({
        protocol_id,
        protocol_name: protocolDoc.filename ?? "filename",
        questionnaire
      });
      res.json({ questionnaire });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate questionnaire', details: err });
    }
  }

  static async save(req: Request, res: Response) {
    try {
      const { protocol_id, protocol_name, questionnaire } = req.body;
      if (!protocol_id || !protocol_name || !questionnaire) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const saved = await Questionnaire.create({
        protocol_id,
        protocol_name,
        questionnaire
      });
      res.status(201).json({ success: true, questionnaire: saved });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save questionnaire', details: err });
    }
  }
}
