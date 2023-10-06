import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { AdminLogIn } from "../controllers/Admin/Auth/Authentication";

import auth from "../middlewares/Auth/auth";
import AuthenticationValidate from "../middlewares/RequestValidator/AuthenticationRequestValidator";
import { UserRole, checkUserRole } from "../middlewares/Auth/role";
import { create, get, remove, update } from "../controllers/Admin/ProductController";
import  ProductValidate from "../middlewares/RequestValidator/ProductRequestValidator";
 "../middlewares/RequestValidator/ProductRequestValidator";

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/auth/login",
  AuthenticationValidate("login"),
  AdminLogIn
);

router.use(auth.verifyjwtToken);
router.get('/products', get);
router.use(checkUserRole(UserRole.Admin));
router.post('/products', ProductValidate('create'), upload.array('images', 5), create);
router.put('/products/:id', ProductValidate('create'), upload.array('images', 5), update);
router.delete('/products/:id', remove);

export default router;
