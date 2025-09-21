import { Request, Response } from "express";
import PatientFollowupStatus from "../models/patient-followup-status.schema";
import {
  PatientFollowupStatusCreateRequest,
  PatientFollowupStatusUpdateRequest,
  PatientFollowupStatusQuery,
  PatientFollowupStatusStats,
} from "../types/patient-followup-status.types";

export class PatientFollowupStatusController {
  public async getPatientFollowupsSimple(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id: patient_id } = req.params;
      const followupRecords = await PatientFollowupStatus.find({
        patient_id: parseInt(patient_id),
      }).sort({ time_utc: -1 });

      res.status(200).json({
        success: true,
        data: followupRecords,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving followups",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
