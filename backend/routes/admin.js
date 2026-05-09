import { Router } from "express";
import {authorizeRoles} from "../middleware/authmiddlerware.js";
import { protect } from "../middleware/authmiddlerware.js";
import { adminregister,getAllUsers ,deleteUser} from "../contoller/admincontroller.js";

const router= Router();
 
router.use( protect , authorizeRoles("ADMIN") );

router.post('/users',adminregister); //register the User(employee,front desk)
router.get('/users',getAllUsers);// get all user detail
router.delete('/users/:id',deleteUser); // delete user



export default router;