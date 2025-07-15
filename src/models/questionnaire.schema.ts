import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionnaire extends Document {
  questionnaireID: string;
  studyID: mongoose.Types.ObjectId;
  questions: { text: string; type: string }[];
  version: string;
  status: string;
}

const QuestionnaireSchema: Schema = new Schema({
  questionnaireID: { type: String, required: true, unique: true },
  studyID: { type: Schema.Types.ObjectId, ref: 'Study', required: true },
  questions: [{ text: String, type: String }],
  version: { type: String, required: true },
  status: { type: String, required: true },
});

export default mongoose.model<IQuestionnaire>('questionnaires', QuestionnaireSchema);
