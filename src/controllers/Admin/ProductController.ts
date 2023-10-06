import { Request, Response } from "express";
import responseHelper from "../../helpers/ResponseHelper/responseHelper";
import { StatusCodes } from "../../utils/ResponseCodes/resCode";
import Product from "../../models/Product";
import { validationResult } from "express-validator";

export async function create(req: any, res: Response) {
  try {
    const errors: any = validationResult(req.body);
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

    const productData = req.body;
    productData.images = req.files.map(
      (file: any) => `/uploads/${file.filename}`
    );

    const product = new Product(productData);
    await product.save();

    return res
      .status(200)
      .send(
        responseHelper.responseWithData(
          true,
          StatusCodes.CREATED,
          "Product created successfully!",
          product
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

export async function get(req: any, res: Response) {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    const products = await Product.find().skip(skip).limit(Number(perPage));
    const productCount = await Product.count();

    return res
      .status(200)
      .send(
        responseHelper.responseWithData(
          true,
          StatusCodes.OK,
          "Product List",
          { products, productCount}
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

export async function update(req: any, res: Response) {
  try {
    const errors: any = validationResult(req.body);
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

    const productData = req.body;
    productData.images = req.files.map(
      (file: any) => `/uploads/${file.filename}`
    );

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productData },
      { new: true }
    );

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

    return res
      .status(200)
      .send(
        responseHelper.responseWithData(
          true,
          StatusCodes.CREATED,
          "Product updates successfully!",
          product
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

export async function remove(req: Request, res: Response) {
  try {
    const product = await Product.findById(req.params.id);

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

    await product.remove();
    return res
      .status(200)
      .send(
        responseHelper.responseWithoutData(
          true,
          StatusCodes.OK,
          "Product removed successfully!"
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
