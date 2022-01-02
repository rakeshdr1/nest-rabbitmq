import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async all() {
    return this.productModel.find().exec();
  }

  async createProduct(data) {
    return new this.productModel(data).save();
  }

  async updateProduct(data) {
    return this.productModel.findOneAndUpdate({ id: data.id }, data);
  }

  async deleteProduct(id: string) {
    return this.productModel.deleteOne({ id });
  }
}
