import { Router } from 'express';
import { UploadedProtocolDetailsController } from '../controllers/uploaded-protocol-details.controller';

const router = Router();

router.get('/', UploadedProtocolDetailsController.list);

export default router;
