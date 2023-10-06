import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Helper from "../../helpers/ResponseHelper/responseHelper";
import { ReasonMessage, StatusCodes } from "../../utils/ResponseCodes/resCode";

class autorizationController {
  // API Authorization

  verifyjwtToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token) {
      return res
        .status(200)
        .send(
          Helper.responseWithoutData(
            false,
            StatusCodes.UNAUTHORIZED,
            ReasonMessage.UNAUTHORIZED
          )
        );
    }
    try {
      const decoded: any = jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRETKEY
      );
      //@ts-ignore
      req.token_payload = decoded;
    } catch (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          Helper.responseWithoutData(
            false,
            StatusCodes.UNAUTHORIZED,
            ReasonMessage.UNAUTHORIZED
          )
        );
    }
    return next();
  };
}

export default new autorizationController();
