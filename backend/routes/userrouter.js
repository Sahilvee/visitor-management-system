import { Router } from "express";
import { userget } from "../contoller/usercontroller.js";
const router=Router();

   router.get("/",userget);

export default router;