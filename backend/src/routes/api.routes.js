import express from 'express';
import cors from 'cors';
import { registerController } from '../register/register.controller';
import { loginController } from '../login/login.controller';
import auth from '../middlewares/auth';
import isAdmin from '../middlewares/admin';
import { workoutDiaryController } from '../workoutDiary/workoutDiary.controller';
import { profileController } from '../profile/profile.controller';
import { articleController } from '../articles/article.controller';
import { sportTypeController } from '../sportType/sportType.controller';
import { unitController } from '../units/unit.controller';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post('/register', registerController.post);
router.post('/login', loginController.post);
router.patch('/users', auth, profileController.patch);
router.get('/articles', articleController.get);
router.post('/diaries', auth, workoutDiaryController.post);
router.get('/diaries', auth, workoutDiaryController.get);
router.patch('/diaries', auth, workoutDiaryController.patchRemove);
router.patch('/diaries/:workoutId', auth, workoutDiaryController.patchEdit);
router.get('/sports', auth, sportTypeController.get);
router.post('/admin/sports', auth, isAdmin, sportTypeController.post);
router.delete('/admin/sports/:sportTypeId', auth, isAdmin, sportTypeController.delete);
router.get('/units', auth, unitController.get);

export default router;
