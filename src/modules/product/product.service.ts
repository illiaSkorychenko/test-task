import { MessageBroker } from '../../types/interfaces/connectors/MessageBroker';
import { ProductRepo } from '../../types/interfaces/repos/ProductRepo';
import { CreateProductDto } from '../../types/dtos/product/CreateProductDto';
import { PaginationDto } from '../../types/dtos/common/PaginationDto';
import { NotificationMessageDto } from '../../types/dtos/notification/NotificationMessageDto';
import { NotificationTypes } from '../../types/enums/common/NotificationTypes';
import { MetricService } from '../../types/interfaces/connectors/MetricService';

export class ProductService {
  constructor(
    private messageBroker: MessageBroker,
    private productRepo: ProductRepo,
    private metricService: MetricService
  ) {}

  private async sendMessageToBroker(type: NotificationTypes, queueName: string) {
    const message: NotificationMessageDto = {
      type
    };
    await this.messageBroker.sendMessage(message, queueName);
  }

  async create(data: CreateProductDto, queueName: string) {
    const createdProduct = await this.productRepo.create(data);

    await this.metricService.incActionCounter(NotificationTypes.ProductCreate);
    await this.sendMessageToBroker(NotificationTypes.ProductCreate, queueName);

    return createdProduct;
  }

  async getAll(paginationOpt: PaginationDto) {
    const products = await this.productRepo.getAll(paginationOpt);
    const count = await this.productRepo.count();

    return {
      products,
      count
    };
  }

  async delete(id: string, queueName: string) {
    await this.productRepo.deleteByIdOrFail(id);
    await this.metricService.incActionCounter(NotificationTypes.ProductDelete);
    await this.sendMessageToBroker(NotificationTypes.ProductDelete, queueName);
  }
}
