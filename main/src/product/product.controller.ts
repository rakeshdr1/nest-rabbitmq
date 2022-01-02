import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async all() {
    return this.productService.all();
  }

  @EventPattern('product_created')
  async createdProduct(product: any) {
    return await this.productService.createProduct(product);
  }

  @EventPattern('product_updated')
  async updatedProduct(product: any) {
    return this.productService.updateProduct(product);
  }

  @EventPattern('product_deleted')
  async deletedProduct(id: string) {
    return this.productService.deleteProduct(id);
  }
}
