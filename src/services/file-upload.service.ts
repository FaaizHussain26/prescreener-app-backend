import fs from 'fs';
import pdfParse from 'pdf-parse';
import ProtocolDocument from '../models/protocol-document.schema';
import UploadedProtocolDetails from '../models/uploaded-protocol-details.schema';
import openai from '../config/openai';

export class FileUploadService {
  static splitTextIntoChunks(text: string, maxLength = 2000): string[] {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + maxLength));
      start += maxLength;
    }
    return chunks;
  }

  static async processAndStorePDF(file: Express.Multer.File, details: {
    pi: string;
    indication: string;
    enrollment_startDate: Date;
    is_updated: boolean;
    protocol_id: string;
  }) {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const pages = pdfData.text.split(/\f/); 


    const allChunks = [];
    for (const [idx, pageText] of pages.entries()) {
      const textChunks = this.splitTextIntoChunks(pageText.trim(), 2000);
      for (const [subIdx, chunk] of textChunks.entries()) {
        if (!chunk) continue;
        const embedding = await this.getEmbedding(chunk);
        allChunks.push({
          text: chunk,
          embedding,
          page: idx + 1,
          chunk: subIdx + 1,
        });
      }
    }


    const doc = await ProtocolDocument.create({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      chunks: allChunks,
      uploadedAt: new Date(),
    });
    const uploadedDetails = await UploadedProtocolDetails.create({
      pi: details.pi,
      indication: details.indication,
      enrollment_startDate: details.enrollment_startDate,
      is_updated: details.is_updated,
      protocol_id: details.protocol_id,
      file: doc._id,
    });
    return { protocolDocument: doc, uploadedDetails };
  }

  static async getEmbedding(text: string): Promise<number[]> {
    const resp = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return resp.data[0].embedding;
  }
}
