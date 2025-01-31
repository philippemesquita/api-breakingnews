import { Router } from 'express';
import newsController from '../controllers/news.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/", authMiddleware, newsController.create);
router.get("/", newsController.findAll);
router.get("/top", newsController.topNews);
router.get("/search", newsController.searchByTitle);
router.get("/byUser", authMiddleware, newsController.byUser);
router.get("/:id", authMiddleware, newsController.findAllById);
router.patch("/:id", authMiddleware, newsController.update);
router.delete("/:id", authMiddleware, newsController.erase);
router.patch("/like/:id", authMiddleware, newsController.linkeNews);
router.patch("/comment/:id", authMiddleware, newsController.addComment);
router.patch("/comment/:idNews/:idComment", authMiddleware, newsController.deleteComment);


export default router;