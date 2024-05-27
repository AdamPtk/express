import { Router } from "express";
import authRouter from "./auth.mjs";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";

const router = Router();

router.use(authRouter);
router.use(usersRouter);
router.use(productsRouter);

export default router;
