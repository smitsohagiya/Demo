import { Request, Response } from "express";
import Product from "../../models/Product";
import responseHelper from "../../helpers/ResponseHelper/responseHelper";
import { StatusCodes } from "../../utils/ResponseCodes/resCode";
import Order from "../../models/Order";
import { validationResult } from "express-validator";

export async function purchaseProduct(req: Request, res: Response) {
  try {

    const errors: any = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(200)
        .send(
          responseHelper.responseWithoutData(
            false,
            StatusCodes.BAD_REQUEST,
            errors.errors[0].msg
          )
        );
    }

    //@ts-ignore
    const payloadTokenUserId = req.token_payload._id;
    const { product_id, quantity } = req.body;
    const product = await Product.findById(product_id);

    if (!product) {
      return res
        .status(200)
        .send(
          responseHelper.responseWithoutData(
            false,
            StatusCodes.NOT_FOUND,
            "Product Not Found"
          )
        );
    }

    if(product.stock === 0){
      return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          false,
          StatusCodes.BAD_REQUEST,
          "Product is out of stocks"
        )
      );
    }

    const order = new Order({
      user_id: payloadTokenUserId,
      product_id,
      quantity,
    });
    await order.save();

    product.stock -= quantity;
    await product.save();

    return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          true,
          StatusCodes.OK,
          "Product purchase successfully!"
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          false,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
}
