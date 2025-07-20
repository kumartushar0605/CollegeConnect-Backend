import express from "express"
import { register ,students,teaForm,rate,get,send,login,getMyProfile,up,logout,edit} from "../controllers/teacher.js";
import { isAuthenticated } from "../middlewares/auth.js";


const routerr = express.Router();

routerr.post("/registerr",register);
routerr.post("/teaForm/:email",teaForm);
routerr.get("/doubtss",students)
routerr.post("/rate/:email",rate);
routerr.get("/get/:email",get);
routerr.post("/sendd",send);
routerr.post("/Tlogin",login);
routerr.get("/Tme",isAuthenticated,getMyProfile)
routerr.post("/up/:email",up);
routerr.get("/teacher/logout",logout)
routerr.put("/editT/:email",edit)









export default routerr;