import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { idParamSchema } from '../validators/common.js';
import {
  taskBodySchema,
  taskListQuerySchema,
  taskStatusSchema,
} from '../validators/taskValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(taskListQuerySchema, 'query'), taskController.list);
router.post('/', validate(taskBodySchema), taskController.create);
router.get('/:id', validate(idParamSchema, 'params'), taskController.getById);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(taskBodySchema),
  taskController.update,
);
router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  validate(taskStatusSchema),
  taskController.setStatus,
);
router.delete('/:id', validate(idParamSchema, 'params'), taskController.remove);

export default router;
