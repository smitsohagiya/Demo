import jwt from "jsonwebtoken";

class Helper {
  responseWithData(
    responseStatus: Boolean,
    responseCode: Number,
    responseMessage: String,
    responseData: any
  ) {
    return {
      responseStatus: responseStatus,
      responseCode: responseCode,
      responseMessage: responseMessage,
      responseData: responseData,
    };
  }
  responseWithoutData(
    responseStatus: Boolean,
    responseCode: Number,
    responseMessage: String
  ) {
    return {
      responseStatus: responseStatus,
      responseCode: responseCode,
      responseMessage: responseMessage,
    };
  }

  generate_Token(payload: any) {
    return jwt.sign(payload, `${process.env.JWT_SECRETKEY}`, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  getOtp() {
    let otp = Math.floor(Math.random() * 1000 + 1000);
    return otp;
  }
}

export default new Helper();
