import mongoose, { Document, Schema } from "mongoose";

interface Product extends Document {
  title: string;
  images: string[];
  price: number;
  discountPrice?: number;
  description: string;
  stock: number;
}

const productSchema = new Schema<Product>(
  {
    title: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Product>("Product", productSchema);
