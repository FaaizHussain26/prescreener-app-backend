import mongoose, { Document, Schema } from 'mongoose';

export interface QuestionnaireDocument extends Document {
  protocol_id: string;
  protocol_name: string;
  questionnaire: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireSchema = new Schema<QuestionnaireDocument>(
  {
    protocol_id: { type: String, required: true },
    protocol_name: { type: String, required: true },
    questionnaire: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<QuestionnaireDocument>('questionnaires', QuestionnaireSchema);