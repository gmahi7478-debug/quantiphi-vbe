import { Router } from 'express';
import {
  createSubscription,
  getSubscriptions,
  patchSubscriptionStatus,
} from '../controllers/subscriptionController.js';

const router = Router();

router.get('/', getSubscriptions);
router.post('/', createSubscription);
router.patch('/:id/status', patchSubscriptionStatus);

export default router;