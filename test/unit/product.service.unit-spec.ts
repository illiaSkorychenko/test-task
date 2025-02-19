import { randomUUID } from 'crypto';
import { ProductService } from '../../src/modules/product/product.service';
import { NotificationTypes } from '../../src/types/enums/common/NotificationTypes';
import { MessageBroker } from '../../src/types/interfaces/connectors/MessageBroker';
import { MetricService } from '../../src/types/interfaces/connectors/MetricService';
import { ProductRepo } from '../../src/types/interfaces/repos/ProductRepo';

describe('ProductService', () => {
  let messageBroker: MessageBroker;
  let productRepo: ProductRepo;
  let metricService: MetricService;

  beforeAll(() => {
    messageBroker = {
      sendMessage: jest.fn(),
      deleteMessage: jest.fn(),
      receiveMessage: jest.fn()
    };
    productRepo = {
      getAll: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      deleteByIdOrFail: jest.fn()
    };
    metricService = {
      getMetrics: jest.fn(),
      incActionCounter: jest.fn()
    };

    new ProductService(messageBroker, productRepo, metricService);
  });

  it('should create and call services', async () => {
    const data = { name: 'product', price: 100 };
    const queueName = 'queue';
    const createdProduct = { id: randomUUID(), ...data };

    (productRepo.create as jest.Mock).mockResolvedValue(createdProduct);

    const productService = new ProductService(messageBroker, productRepo, metricService);
    const result = await productService.create(data, queueName);

    expect(result).toEqual(createdProduct);
    expect(productRepo.create).toHaveBeenCalledWith(data);
    expect(metricService.incActionCounter).toHaveBeenCalledWith(NotificationTypes.ProductCreate);
    expect(messageBroker.sendMessage).toHaveBeenCalledWith(
      { type: NotificationTypes.ProductCreate },
      queueName
    );
  });

  it('should getAll and call services', async () => {
    const paginationOpt = { limit: 10, offset: 0 };
    const products = [{ id: randomUUID(), name: 'product', price: 100 }];
    const count = 1;

    (productRepo.getAll as jest.Mock).mockResolvedValue(products);
    (productRepo.count as jest.Mock).mockResolvedValue(count);

    const productService = new ProductService(messageBroker, productRepo, metricService);
    const result = await productService.getAll(paginationOpt);

    expect(result).toEqual({ products, count });
    expect(productRepo.getAll).toHaveBeenCalledWith(paginationOpt);
    expect(productRepo.count).toHaveBeenCalled();
  });

  it('should delete and call services', async () => {
    const id = randomUUID();
    const queueName = 'queue';

    const productService = new ProductService(messageBroker, productRepo, metricService);
    await productService.delete(id, queueName);

    expect(productRepo.deleteByIdOrFail).toHaveBeenCalledWith(id);
    expect(metricService.incActionCounter).toHaveBeenCalledWith(NotificationTypes.ProductDelete);
    expect(messageBroker.sendMessage).toHaveBeenCalledWith(
      { type: NotificationTypes.ProductDelete },
      queueName
    );
  });
});
