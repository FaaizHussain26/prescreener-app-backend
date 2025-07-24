import { Request, Response } from 'express';
import { FileUploadService } from '../services/file-upload.service';

export class FileUploadController {
  static async uploadPDF(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const { protocolDocument, uploadedDetails } = await FileUploadService.processAndStorePDF(req.file, {
        pi: req.body.pi,
        indication: req.body.indication,
        enrollment_startDate: req.body.enrollment_startDate,
        is_updated: req.body.is_updated === 'true' || req.body.is_updated === true,
        protocol_id: req.body.protocol_id,
      });
      res.status(201).json({
        message: 'PDF processed and stored',
        protocolDocumentId: protocolDocument._id,
        uploadedDetailsId: uploadedDetails._id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process PDF' });
    }
  }
}
