import  { Router } from "express";
import { registerUser, registerUserAdmit } from "../controller/user/registration.js";

const userRouter = Router();

userRouter.post("/registeradmit", registerUserAdmit);
userRouter.post("/register", registerUser);

export default userRouter;