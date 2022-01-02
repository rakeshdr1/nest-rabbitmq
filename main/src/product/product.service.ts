import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private httpService: HttpService,
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

  async likeProduct(id: string) {
    const product = await this.productModel.findOne({ id });
    product.likes = product.likes + 1;
    await product.save();

    this.httpService
      .post(`http://localhost:3000/api/v1/products/${id}/like`, {})
      .subscribe();
    return product;
  }
}
