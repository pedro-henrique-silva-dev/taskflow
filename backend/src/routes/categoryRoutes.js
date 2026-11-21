import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { categoryBodySchema } from '../validators/categoryValidators.js';
import { idParamSchema } from '../validators/common.js';

const router = Router();

router.use(authenticate);

router.get('/', categoryController.list);
router.post('/', validate(categoryBodySchema), categoryController.create);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(categoryBodySchema),
  categoryController.update,
);
router.delete('/:id', validate(idParamSchema, 'params'), categoryController.remove);

export default router;
