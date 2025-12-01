import { Router } from 'express';
import { telegramAuth } from '../middleware/telegramAuth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import userRouter from './user.routes.js';
import paymentRouter from './payment.routes.js';
import contentRouter from './content.routes.js';
import referralRouter from './referral.routes.js';
import adminRouter from './admin.routes.js';
import creditsRouter from './credits.routes.js';

export const router = Router();

router.use('/user', telegramAuth, userRouter);
router.use('/payment', telegramAuth, paymentRouter);
router.use('/content', telegramAuth, contentRouter);
router.use('/referral', telegramAuth, referralRouter);
router.use('/admin', adminAuth, adminRouter);
router.use('/credits', adminAuth, creditsRouter);

