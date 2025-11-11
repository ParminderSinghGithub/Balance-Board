import express from 'express';
import * as authController from '../controllers/auth.controller';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/profile', isAuth, authController.getProfile);

router.delete('/delete-account', isAuth, authController.deleteAccount);

router.post('/request-password-reset', authController.requestPasswordReset);

router.post('/reset-password', authController.resetPassword);

export default router;
