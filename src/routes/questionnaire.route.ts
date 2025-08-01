import { Router } from 'express';
import { QuestionnaireController } from '../controllers/questionnaire.controller';

const router = Router();

router.post('/generate', QuestionnaireController.generate);
router.post('/save', QuestionnaireController.save);

export default router;
