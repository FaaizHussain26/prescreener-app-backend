import mongoose, { Document, Schema } from 'mongoose';

export interface IProtocolDocumentChunk {
  text: string;
  embedding: number[];
  page: number;
}

export interface IProtocolDocument extends Document {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  chunks: IProtocolDocumentChunk[];
  uploadedAt: Date;
}

const ProtocolDocumentChunkSchema = new Schema<IProtocolDocumentChunk>(
  {
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    page: { type: Number, required: true }
  },
  { _id: false }
);

const ProtocolDocumentSchema = new Schema<IProtocolDocument>(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    chunks: { type: [ProtocolDocumentChunkSchema], required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<IProtocolDocument>('protocol-documents', ProtocolDocumentSchema);
