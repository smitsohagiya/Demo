import { Router } from "express";
import apiRoutes from "./Api";
import adminRoutes from "./Admin";
import { checkUserRole, UserRole } from "../middlewares/Auth/role";

const MainRoute = Router();

MainRoute.use("/api", apiRoutes);
MainRoute.use("/admin", adminRoutes);

export default MainRoute;
