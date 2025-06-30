import  { Router } from "express";
import { registerUser } from "../controller/user/registration.js";

const userRouter = Router();

userRouter.post("/register", registerUser);

export default userRouter;