
import express, { Express, Router, NextFunction, Request, Response } from 'express';
import userVerificationController from '../../Controllers/UserVerificationController/UserVerifivationController';


const userLevelRouter = express.Router();


userLevelRouter.post('/getAll',
    // authController.AuthToken,
    userVerificationController.GetAllUserVerifications);

userLevelRouter.get('/getById/:id',
    // authController.AuthToken,
    userVerificationController.GetByIdUserVerification);

userLevelRouter.put('/changeStatus/:id',
    // authController.AuthToken,
    userVerificationController.ChangeUserVerificationStatus);

export default userLevelRouter;