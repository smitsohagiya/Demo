import { body, check } from "express-validator";
export default function AuthenticationValidate(methodName: String) {
  switch (methodName) {
    case "signup": {
      return [
        body("name")
          .notEmpty()
          .withMessage("First name is required")
          .isLength({ min: 2, max: 30 })
          .withMessage("First name must be min 2 and max 30 characters long")
          .isAlpha("en-US", { ignore: " " })
          .withMessage("First name must be in Alphabetic"),

        body("email")
          .notEmpty()
          .withMessage("Email field is required")
          .isEmail()
          .withMessage("invalid Email")
          .isLength({ min: 8, max: 75 })
          .withMessage("Email length must be min 8 and more than 75"),

        body("password")
          .notEmpty()
          .withMessage("password is required")
          .isLength({ min: 8, max: 15 })
          .withMessage("password must be 8 characters long"),
      ];
    }

    case "login": {
      return [
        body("email")
          .notEmpty()
          .withMessage("Email field is required")
          .isEmail()
          .withMessage("invalid Email")
          .isLength({ min: 8, max: 75 })
          .withMessage("Email length must be min 8 and more than 75"),

        body("password")
          .notEmpty()
          .withMessage("password is required")
          .isLength({ min: 8, max: 15 })
          .withMessage("password must be 8 characters long"),
      ];
    }
    case "edit-profile": {
      return [
        body("email")
          .notEmpty()
          .withMessage("Email field is required")
          .isEmail()
          .withMessage("invalid Email")
          .isLength({ min: 8, max: 75 })
          .withMessage("Email length must be min 8 and more than 75"),

        body("name")
          .notEmpty()
          .withMessage("First name is required")
          .isLength({ min: 2, max: 30 })
          .withMessage("First name must be min 2 and max 30 characters long")
          .isAlpha("en-US", { ignore: " " })
          .withMessage("First name must be in Alphabetic"),
      ];
    }
    case "forgetPassword": {
      return [
        body("email")
          .notEmpty()
          .withMessage("Email field is required")
          .isEmail()
          .withMessage("invalid Email")
          .isLength({ min: 8, max: 75 })
          .withMessage("Email length must be min 8 and more than 75"),
      ];
    }
    case "resetPassword": {
      return [
        body("new_password")
          .notEmpty()
          .withMessage("New Password is required")
          .isLength({ min: 8, max: 15 })
          .withMessage("Password must be 8 characters long"),

        body("confirm_password")
          .notEmpty()
          .withMessage("Confirm Password is required")
          .isLength({ min: 8, max: 15 })
          .withMessage("Password must be 8 characters long"),
      ];
    }
    default: {
      return [body("invalid Method")];
    }
  }
}
