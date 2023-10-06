import responseHelper from "../../helpers/ResponseHelper/responseHelper";
import { ReasonMessage, StatusCodes } from "../../utils/ResponseCodes/resCode";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export function checkUserRole(requiredRole: UserRole) {
  return (req: any, res: any, next: any) => {
    const userRole = req.token_payload.role;

    if (userRole === requiredRole) {
      next();
    } else {
      return res
        .status(200)
        .send(
          responseHelper.responseWithoutData(
            false,
            StatusCodes.UNAUTHORIZED,
            ReasonMessage.UNAUTHORIZED
          )
        );
    }
  };
}
