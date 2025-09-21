import mongoose, { Schema, Document } from "mongoose";

export interface IPatientFollowupStatus extends Document {
  followup_id: string;
  patient_id: number;
  patient_contactno: string;
  agent_id: string;
  conversation_id: string;
  call_status: boolean;
  shift: string;
  transcript: string;
  summary: string;
  summary_title: string;
  time_utc: Date;
  call_dusation_secs?: number;
  system_prompt: string;
  followup_type:
    | "initial"
    | "reminder"
    | "reschedule"
    | "confirmation"
    | "followup";
  followup_status:
    | "scheduled"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "no_answer"
    | "busy"
    | "failed";
  next_followup_date?: Date;
  notes?: string;
  appointment_id?: mongoose.Types.ObjectId;
  lead_id?: mongoose.Types.ObjectId;
  study_id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PatientFollowupStatusSchema: Schema = new Schema(
  {
    followup_id: {
      type: String,
      required: true,
      unique: true,
    },
    patient_id: {
      type: Number,
      required: true,
    },
    patient_contactno: {
      type: String,
      required: true,
    },
    agent_id: {
      type: String,
      required: true,
    },
    conversation_id: {
      type: String,
      required: true,
      unique: true,
    },
    call_status: {
      type: Boolean,
      required: true,
      default: false,
    },
    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
    },
    transcript: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    summary_title: {
      type: String,
      required: true,
    },
    time_utc: {
      type: Date,
      required: true,
    },
    call_dusation_secs: {
      type: Number,
      default: null,
    },
    system_prompt: {
      type: String,
      required: true,
    },
    followup_type: {
      type: String,
      required: true,
      enum: ["initial", "reminder", "reschedule", "confirmation", "followup"],
      default: "initial",
    },
    followup_status: {
      type: String,
      required: true,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
        "rescheduled",
        "no_answer",
        "busy",
        "failed",
      ],
      default: "scheduled",
    },
    next_followup_date: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    appointment_id: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    study_id: {
      type: Schema.Types.ObjectId,
      ref: "Study",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "Patient_Followup_Status",
  }
);

// Indexes for better query performance
PatientFollowupStatusSchema.index({ patient_id: 1 });
PatientFollowupStatusSchema.index({ patient_contactno: 1 });
PatientFollowupStatusSchema.index({ followup_status: 1 });
PatientFollowupStatusSchema.index({ followup_type: 1 });
PatientFollowupStatusSchema.index({ time_utc: 1 });
PatientFollowupStatusSchema.index({ conversation_id: 1 });

export default mongoose.model<IPatientFollowupStatus>(
  "Patient_Followup_Status",
  PatientFollowupStatusSchema
);
