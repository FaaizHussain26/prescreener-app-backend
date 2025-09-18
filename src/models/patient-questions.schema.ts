import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientQuestions extends Document {
  // Form data from interest form
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNo1: string;
  phoneNo2?: string;
  email?: string;
  dateOfBirth?: string;
  studyOfInterest: string[];
  submittedBy: string;
  bestTimeToCall?: string[];
  mailingAddress?: string;
  streetAddress?: string;
  apartmentNumber?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  specialInstruction?: string;
  acceptTerms: boolean;
  // patient_id
  patientId?: string;
  
  // Generated questions
  questions: string;
  
  // Protocol information
  protocol_id?: string;
  protocol_name?: string;
  indication?: string;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

const PatientQuestionsSchema = new Schema<IPatientQuestions>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phoneNo1: { type: String, required: true },
    phoneNo2: { type: String },
    email: { type: String },
    dateOfBirth: { type: String },
    studyOfInterest: { type: [String], required: true },
    submittedBy: { type: String, required: true },
    bestTimeToCall: { type: [String] },
    mailingAddress: { type: String },
    streetAddress: { type: String },
    apartmentNumber: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    specialInstruction: { type: String },
    acceptTerms: { type: Boolean, required: true },
    patientId: { type: String },
    
    questions: { type: String, required: true },
    
    protocol_id: { type: String },
    protocol_name: { type: String },
    indication: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPatientQuestions>('patient-questions', PatientQuestionsSchema);
