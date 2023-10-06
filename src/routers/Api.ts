import { Router } from "express";
import UserSignUp, {
  UserLogIn,
  UserForgotPassword,
  UserForgotPasswordVerifyToken,
  UserResetPassword,
  UserUpdateProfile,
} from "../controllers/Api/Auth/AuthenticationController";

import auth from "../middlewares/Auth/auth";
import AuthenticationValidate from "../middlewares/RequestValidator/AuthenticationRequestValidator";
import { purchaseProduct } from "../controllers/Api/UserController";
import ProductValidate from "../middlewares/RequestValidator/ProductRequestValidator";

const router: Router = Router();

router.post("/auth/register", AuthenticationValidate("signup"), UserSignUp);
router.post("/auth/login", AuthenticationValidate("login"), UserLogIn);
router.post(
  "/auth/forgot-password",
  AuthenticationValidate("forgetPassword"),
  UserForgotPassword
);
router.get("/check-verify-token/:token", UserForgotPasswordVerifyToken);
router.post(
  "/check-verify-token/:token",
  AuthenticationValidate("resetPassword"),
  UserResetPassword
);

router.use(auth.verifyjwtToken);

router.post(
  "/update-profile",
  AuthenticationValidate("edit-profile"),
  UserUpdateProfile
);

router.post(
  "/purchase-product",
  ProductValidate("purchase"),
  purchaseProduct
);

export default router;
