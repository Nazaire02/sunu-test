import { Router } from 'express';
import * as controller from '../controllers/workshopController.js';
import { validate } from '../middlewares/validate.js';
import { workshop } from '../validators/workshop.js';
const router = Router();
router.get('/', controller.get);
router.put('/', validate(workshop), controller.save);
export default router;
