import { body, check } from "express-validator";
export default function ProductValidate(methodName: String) {
  switch (methodName) {
    case "create": {
      return [
        body('title').notEmpty().withMessage('Title is required'),
        body('images').isArray().withMessage('Images must be an array'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('discountPrice').optional().isNumeric().withMessage('Discount price must be a number'),
        body('description').notEmpty().withMessage('Description is required'),
        body('stock').isInt().withMessage('Stock must be an integer'),
      ];
    }
    case "purchase": {
      return [
        body('product_id').notEmpty().withMessage('Product id required'),
        body('quantity').notEmpty().withMessage('quantity is required')
      ];
    }
    default: {
      return [body("invalid Method")];
    }
  }
}
