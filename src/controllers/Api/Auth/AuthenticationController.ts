import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../../../models/User";
import * as jwt from "jsonwebtoken";
import UserSignUpRequest, {
  UserLoginRequest
} from "../../../types/userTypes";
import Helper from "../../../helpers/ResponseHelper/responseHelper";
import {
  ReasonMessage,
  StatusCodes,
} from "../../../utils/ResponseCodes/resCode";
import {
  UserFindWithEmail,
  UserFindWithId,
} from "../../../common/CommonFunctions";
import sendMail from "../../../helpers/ResponseHelper/sendMail";
import { validationResult } from "express-validator";

export default async function UserSignUp(req: Request, res: Response) {
  try {
    const payload: UserSignUpRequest = req.body;

    const validationCheck: any = validationResult(req);
    if (!validationCheck.isEmpty()) {
      return res
        .status(200)
        .send(
          Helper.responseWithoutData(
            false,
            StatusCodes.BAD_REQUEST,
            validationCheck.errors[0].msg
          )
        );
    }

    const alreadyExist = await User.findOne({ email: payload.email });

    if (alreadyExist) {
      return res
        .status(200)
        .send(
          Helper.responseWithoutData(
            false,
            StatusCodes.FORBIDDEN,
            "This email id is already exist."
          )
        );
    }
    const newUser = await User.create({
      name: payload.name,
      email: payload.email,
      user_password: bcryptjs.hashSync(payload.password),
    });

    const randomToken = crypto.randomBytes(50).toString("hex");

    const accessToken = Helper.generate_Token({ _id: newUser._id, email: payload.email, role: newUser.role, token: randomToken });
    newUser.token = randomToken;

    await newUser.save();
    return res
      .status(200)
      .send(
        Helper.responseWithData(
          true,
          StatusCodes.OK,
          "Signup successfully.",
          {
            accessToken
          }
        )
      );
  } catch (error: any) {
    return res
      .status(200)
      .send(
        Helper.responseWithoutData(
          true,
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message
        )
      );
  }
}


export async function UserLogIn(req: Request, res: Response) {
  const payload: UserLoginRequest = req.body;

  const validationCheck: any = validationResult(req);
  if (!validationCheck.isEmpty()) {
    return res.status(200).send(Helper.responseWithoutData(false, StatusCodes.BAD_REQUEST, validationCheck.errors[0].msg))
  }

  const existUser = await UserFindWithEmail(payload.email);
  if (!existUser) {
    return res
      .status(200)
      .send(
        Helper.responseWithoutData(
          false,
          StatusCodes.NOT_FOUND,
          "Please check your email or password"
        )
      );
  }

  if (existUser && existUser.user_password) {
    if (bcryptjs.compareSync(payload.password, existUser.user_password)) {

      const randomToken = crypto.randomBytes(50).toString("hex");

      const accessToken = Helper.generate_Token({ _id: existUser._id, email: existUser.email, role: existUser.role, token: randomToken });
      existUser.token = randomToken;

      await existUser.save();
      return res
        .status(200)
        .send(
          Helper.responseWithData(true, StatusCodes.OK, "Login successfully ", {accessToken})
        );
    } else {
      return res
        .status(200)
        .send(
          Helper.responseWithoutData(
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
        Helper.responseWithoutData(
          false,
          StatusCodes.UNAUTHORIZED,
          "Please check your email or password"
        )
      );
  }
}

export async function UserForgotPassword(req: Request, res: Response) {
  const payload: string = req.body.email;

  const validationCheck: any = validationResult(req);
  if (!validationCheck.isEmpty()) {
    return res.status(200).send(Helper.responseWithoutData(false, StatusCodes.BAD_REQUEST, validationCheck.errors[0].msg))
  }

  const existUser = await User.findOne({ email: payload });

  if (!existUser) {
    return res.status(200).send(Helper.responseWithoutData(false, StatusCodes.BAD_REQUEST, "user does not exist"))
  }

  const randomToken = crypto.randomBytes(50).toString("hex");

  const token = Helper.generate_Token({ _id: existUser._id, email: existUser.email, token: randomToken });

  // let time = new Date().getTime();
  let subject = "Reset Your Password";

  let html = `<p>Dear ${existUser.name},<br></br>
  <br></br>
  We have received a request to reset your account password. Please click <a href="${process.env.APP_URL}/api/check-verify-token/${token}\n">here</a> to reset your password.<br></br>
  <br></br>`

  try {
    await sendMail(req.body.email, subject, html);

    existUser.forget_password_token = token;
    await existUser.save();

    return res
      .status(200)
      .send(
        Helper.responseWithoutData(
          true,
          StatusCodes.OK,
          "Link sent successfully"
        )
      );
  } catch (error) {    
    res
      .status(200)
      .send(
        Helper.responseWithoutData(
          false,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
}

export async function UserForgotPasswordVerifyToken(
  req: Request,
  res: Response
) {
  let Authorization = req.params.token;


  if (!Authorization) {
    return res
      .status(200)
      .send(
        Helper.responseWithoutData(
          false,
          StatusCodes.NOT_FOUND,
          ReasonMessage.NOT_FOUND
        )
      );
  }

  //@ts-ignore
  var decoded: any = jwt.verify(Authorization, process.env.JWT_SECRETKEY);

  const userFind = await User.findById(decoded._id);
  if (!userFind) {
    return res.status(200).send(Helper.responseWithoutData(false, StatusCodes.NOT_FOUND, "This user dose not exist."));
  }

  if (!userFind.forget_password_token) {
    return res.render("linkexpirepage")
  }
  res.render("passwordReset")

}

export async function UserResetPassword(req: Request, res: Response) {
  const payloadData = req.body;
  const Authorization = req.params.token;

  const validationCheck: any = validationResult(req);
  if (!validationCheck.isEmpty()) {
    return res.status(200).send(Helper.responseWithoutData(false, StatusCodes.BAD_REQUEST, validationCheck.errors[0].msg))
  }

  if (!Authorization) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        Helper.responseWithoutData(
          false,
          StatusCodes.BAD_REQUEST,
          ReasonMessage.BAD_REQUEST
        )
      );
  }

  if (payloadData.new_password !== payloadData.confirm_password) {
    return res
      .status(200)
      .send(Helper.responseWithoutData(false, StatusCodes.FORBIDDEN, "Password Mismatch. Please check again."));
  }
  try {
    //@ts-ignore
    var decoded: any = jwt.verify(Authorization, process.env.JWT_SECRETKEY);

    const existUser = await User.findById(decoded._id);
    if (!existUser) {
      return res.status(200).send(Helper.responseWithoutData(false, StatusCodes.NOT_FOUND, "This user dose not exist."));
    }

    await User.findByIdAndUpdate(
      { _id: decoded._id },
      { user_password: bcryptjs.hashSync(payloadData.new_password) },
      { new: true }
    )

    existUser.forget_password_token = "";
    await existUser.save();
    return res.render("thankyou")
  } catch (error) {
    return res
      .status(200)
      .send(
        Helper.responseWithoutData(
          false,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
}

export async function UserUpdateProfile(req: Request, res: Response) {
  //@ts-ignore
  const payloadTokenUserId = req.token_payload._id;
  const payloadData = req.body;

  let existUser = await UserFindWithId(payloadTokenUserId);
  if(payloadData.email != existUser.email){
    const exist_email = await User.findOne({ email: payloadData.email });
  
    if (exist_email) {
      return res
        .status(200)
        .send(
          Helper.responseWithoutData(
            false,
            StatusCodes.CONFLICT,
            "User is already exist"
          )
        );
    }
  }

  try {
    existUser = await User.findOneAndUpdate(
      { _id: existUser._id },
      {
        name: payloadData.name
          ? payloadData.name
          : existUser.name,
        email: payloadData.email ? payloadData.email : existUser.email,
      }, {
      new: true
    }
    );
    
    return res
      .status(200)
      .send(
        Helper.responseWithData(
          true,
          StatusCodes.OK,
          "Profile update successfully",
          existUser
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        Helper.responseWithoutData(
          false,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Somethings went wrongs"
        )
      );
  }
}