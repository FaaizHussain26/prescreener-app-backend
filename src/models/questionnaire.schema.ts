import mongoose, { Document, Schema } from 'mongoose';

export interface QuestionnaireDocument extends Document {
  protocol_id: mongoose.Types.ObjectId | string;
  protocol_name: string;
  questionnaire: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireSchema = new Schema<QuestionnaireDocument>(
  {
    protocol_id: { type: Schema.Types.ObjectId, ref: 'ProtocolDocument', required: true },
    protocol_name: { type: String, required: true },
    questionnaire: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<QuestionnaireDocument>('questionnaires', QuestionnaireSchema);
