import { Router } from "express";
import upload from "../middleware/uploadmiddleware.js";
import { createVisitor,getAllVisitors,verifyVisitor,deleteVisitor } from "../contoller/visitorcontroller.js";
import { createotp, verifyOtp } from "../contoller/otpcontroller.js";
import { protect } from "../middleware/authmiddlerware.js";
const router= Router();

 router.post('/',upload.single("image"), createVisitor);
router.get("/", protect, getAllVisitors );

router.patch("/:id/verify", protect,  verifyVisitor);
router.delete("/:id",  protect,  deleteVisitor);


export default router;