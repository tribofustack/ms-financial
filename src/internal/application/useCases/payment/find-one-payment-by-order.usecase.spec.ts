import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Inject } from '@nestjs/common';
import { FindOnePaymentByOrderId } from './find-one-payment-by-order.usecase';
import { IPaymentRepository } from 'src/internal/domain/payment/repositories/payment.repository';
import { Payment } from 'src/internal/domain/payment/entities/payment.entity';

describe('FindOnePaymentByOrderId', () => {
  let findOnePaymentByOrderId: FindOnePaymentByOrderId;
  let paymentRepositoryMock: jest.Mocked<IPaymentRepository>;

  beforeAll(async () => {
    paymentRepositoryMock = {
      findOneByOrderId: jest.fn(),
    } as unknown as jest.Mocked<IPaymentRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOnePaymentByOrderId,
        { provide: 'PaymentRepository', useValue: paymentRepositoryMock },
      ],
    }).compile();

    findOnePaymentByOrderId = module.get<FindOnePaymentByOrderId>(FindOnePaymentByOrderId);
  });

  describe('execute', () => {
    it('should find and return the payment', async () => {
      const orderId = 'testOrderId';
      const customerId = 'testCustomerId';
      const payment = new Payment({
        id: 'paymentId1',
        customerId: customerId,
        orderId: orderId,
        value: 10,
      });

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(payment);

      const result = await findOnePaymentByOrderId.execute(orderId);

      expect(result).toEqual(payment);
    });

    it('should throw NotFoundException if the payment does not exist', async () => {
      const orderId = 'nonExistentOrderId';

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(null);

      await expect(findOnePaymentByOrderId.execute(orderId)).rejects.toThrow(NotFoundException);
    });
  });
});
