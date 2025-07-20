import express from "express"
import { register ,students,stuForm,update,doubts,login,data,status,getMyProfile,address,payment,sec,deletee, logout,edit} from "../controllers/student.js";
import { isAuthenticatedd } from "../middlewares/auth.js";



const router = express.Router();

router.post("/register",register);
router.post("/stuForm/:email",stuForm);
router.post("/update",update)
router.get("/subjects/:semester",students)
router.post("/doubts",doubts);
router.post("/Slogin",login);
router.get("/data",data);
router.post("/status/:email",status);
router.get("/Sme",isAuthenticatedd,getMyProfile)
router.get("/address/:email",address);
router.post("/pay/:email",payment);
router.post("/sec/:email",sec);
router.post("/delete",deletee);
router.get("/student/logout",logout)
router.put("/editS/:email",edit)












export default router;