import { Router } from 'express';
import { asyncHandler, validate } from '@/middleware';
import { idParamSchema } from '@/schemas';
import { jobController } from '@/controllers';

const router = Router();

router.get('/', asyncHandler(jobController.list));
router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(jobController.getById),
);

export const jobRoutes = router;
