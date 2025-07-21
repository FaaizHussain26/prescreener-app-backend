import { Request, Response } from 'express';
import { FileUploadService } from '../services/file-upload.service';

export class FileUploadController {
  static async uploadPDF(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const doc = await FileUploadService.processAndStorePDF(req.file);
      res.status(201).json({ message: 'PDF processed and stored', id: doc._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process PDF' });
    }
  }
}
