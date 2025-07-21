import fs from 'fs';
import pdfParse from 'pdf-parse';
import ProtocolDocument from '../models/protocol-document.schema';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class FileUploadService {
  static async processAndStorePDF(file: Express.Multer.File) {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const pages = pdfData.text.split(/\f/); 

    const chunks = await Promise.all(
      pages.map(async (pageText, idx) => {
        const text = pageText.trim();
        if (!text) return null;
        const embedding = await FileUploadService.getEmbedding(text);
        return {
          text: text.slice(0, 4000),
          embedding,
          page: idx + 1,
        };
      })
    );
    const filteredChunks = chunks.filter(Boolean);

    // Store in MongoDB
    const doc = await ProtocolDocument.create({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      chunks: filteredChunks,
      uploadedAt: new Date(),
    });
    return doc;
  }

  static async getEmbedding(text: string): Promise<number[]> {
    // Use OpenAI embedding endpoint
    const resp = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return resp.data[0].embedding;
  }
}
