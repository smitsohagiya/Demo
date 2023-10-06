import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { UserLoginRequest } from "../../../types/userTypes";
import { validationResult } from "express-validator";
import responseHelper from "../../../helpers/ResponseHelper/responseHelper";
import { StatusCodes } from "../../../utils/ResponseCodes/resCode";
import { UserFindWithEmail } from "../../../common/CommonFunctions";
import { UserRole } from "../../../middlewares/Auth/role";

export async function AdminLogIn(req: Request, res: Response) {
  const payload: UserLoginRequest = req.body;

  const validationCheck: any = validationResult(req);
  if (!validationCheck.isEmpty()) {
    return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          false,
          StatusCodes.BAD_REQUEST,
          validationCheck.errors[0].msg
        )
      );
  }

  const existUser = await UserFindWithEmail(payload.email);
  if (!existUser || (existUser && existUser.role != UserRole.Admin)) {
    return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          false,
          StatusCodes.NOT_FOUND,
          "Please check your email or password"
        )
      );
  }

  if (existUser && existUser.user_password) {
    if (bcryptjs.compareSync(payload.password, existUser.user_password)) {
      const randomToken = crypto.randomBytes(50).toString("hex");

      const accessToken = responseHelper.generate_Token({
        _id: existUser._id,
        email: existUser.email,
        role: existUser.role,
        token: randomToken,
      });
      existUser.token = randomToken;

      await existUser.save();
      return res
        .status(200)
        .send(
          responseHelper.responseWithData(
            true,
            StatusCodes.OK,
            "Login successfully ",
            { accessToken }
          )
        );
    } else {
      return res
        .status(200)
        .send(
          responseHelper.responseWithoutData(
            false,
            StatusCodes.UNAUTHORIZED,
            "Please check your email or password"
          )
        );
    }
  } else {
    return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          false,
          StatusCodes.UNAUTHORIZED,
          "Please check your email or password"
        )
      );
  }
}
