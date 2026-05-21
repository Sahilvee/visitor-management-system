import { Router } from "express";
import { userget } from "../controller/usercontroller.js";
const router=Router();

   router.get("/",userget);

export default router;