import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './Dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  all() {
    return this.productsRepository.find();
  }

  async getProduct(id: string) {
    const product = await this.productsRepository.findOne(id);
    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { title, image } = createProductDto;
    const newProduct = this.productsRepository.create({ title, image });
    await this.productsRepository.save(newProduct);
    this.client.emit('product_created', newProduct);
    return newProduct;
  }

  async updateProduct(id: string, title: string) {
    const product = await this.productsRepository.findOne(id);
    product.title = title;
    await this.productsRepository.save(product);
    this.client.emit('product_updated', product);
    return product;
  }

  async deleteProduct(id: string) {
    await this.productsRepository.delete(id);
    this.client.emit('product_deleted', id);
  }

  async likeProduct(id: string) {
    const product = await this.productsRepository.findOne(id);
    product.likes = product.likes += 1;
    await this.productsRepository.save(product);
    return product;
  }
}
