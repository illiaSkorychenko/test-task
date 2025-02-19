import { Body, Controller, Delete, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { PostProductBodyDto } from './validation/PostProductBody';
import { ZodSerializerDto, zodToOpenAPI } from 'nestjs-zod';
import { PostProductRespDto } from './validation/PostProductResp';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductService } from '../../modules/product/product.service';
import { ConfigConnectorService } from '../../connectors/config/config-connector.service';
import { GetProductRespDto } from './validation/GetProductResp';
import {
  LimitSchema,
  OffsetSchema,
  PaginationQueryDto
} from '../common/validation/PaginationQuery';
import { DeleteProductParamDto } from './validation/DeleteProductParam';
import { IdParamSchema } from '../common/validation/IdParam';

@Controller('products')
export class ProductController {
  constructor(
    private configConnector: ConfigConnectorService,

    @Inject(ProductService.name)
    private productsService: ProductService
  ) {}

  @Post('/')
  @ZodSerializerDto(PostProductRespDto)
  @ApiOkResponse({ type: PostProductRespDto, description: 'Create product' })
  public async create(@Body() body: PostProductBodyDto): Promise<PostProductRespDto> {
    const envConfig = this.configConnector.getEnvConfig();

    const createdProduct = await this.productsService.create(
      body,
      envConfig.SQS_NOTIFICATION_QUEUE_URL
    );

    return createdProduct;
  }

  @Get('/')
  @ZodSerializerDto(GetProductRespDto)
  @ApiQuery({ name: 'limit', schema: zodToOpenAPI(LimitSchema) })
  @ApiQuery({ name: 'offset', schema: zodToOpenAPI(OffsetSchema) })
  @ApiOkResponse({ type: GetProductRespDto, description: 'Get products' })
  public async getAll(@Query() query: PaginationQueryDto): Promise<GetProductRespDto> {
    const { products, count } = await this.productsService.getAll({
      limit: query.limit,
      offset: query.offset
    });

    return {
      products,
      count
    };
  }

  @Delete('/:productId')
  @ApiParam({ name: 'productId', schema: zodToOpenAPI(IdParamSchema) })
  public async delete(@Param() param: DeleteProductParamDto) {
    const envConfig = this.configConnector.getEnvConfig();

    await this.productsService.delete(param.productId, envConfig.SQS_NOTIFICATION_QUEUE_URL);
  }
}
