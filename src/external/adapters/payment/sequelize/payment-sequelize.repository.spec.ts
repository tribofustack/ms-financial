import { closeDatabase, initDatabase } from 'src/external/infra/database/sequelize';
import { IPaymentRepository } from 'src/internal/domain/payment/repositories/payment.repository';

import { PaymentSequelizeRepository } from './payment-sequelize.repository';
import { PaymentModel } from './payment-model';

import { Payment } from 'src/internal/domain/payment/entities/payment.entity';

let paymentModel: typeof PaymentModel;
let repository: IPaymentRepository;

describe('Payment Sequelize Repository', () => {
  beforeAll(async () => {
    await initDatabase();
    paymentModel = PaymentModel;
    repository = new PaymentSequelizeRepository(paymentModel);
  });
  afterAll(async () => closeDatabase());

  describe('changeStatus', () => {
    it('should change payment status', async () => {
      // arrange
      const id = 'abcd-efgh-changeStatus';

      await paymentModel.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // act
      await repository.changeStatus(id, 'Pago');
      const payment = await paymentModel.findOne({ where: { id } });

      // assert
      expect(payment).not.toBeUndefined();
      expect(payment).not.toBeNull();
      expect(payment.status).toBe('Pago');
    });
  });
  
  describe('findOneByOrderId', () => {
    it('should get payment by cpf', async () => {
      // arrange
      const id = 'abcd-efgh-findOneByOrderId';

      await paymentModel.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // act
      await repository.findOneByOrderId(id);
      const payment = await repository.findOneByOrderId(id);

      // assert
      expect(payment).not.toBeUndefined();
      expect(payment).not.toBeNull();
    });
  });
  
  describe('findOne', () => {
    it('should get payment by paymentId', async () => {
      // arrange
      const id = 'abcd-efgh-findOne';

      await paymentModel.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // act
      try {
        const payment = await repository.findOne(id);
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
      }
    });
  });
  
  describe('findAll', () => {
    it('should get all payment', async () => {
      // arrange
      const id = 'abcd-efgh-findAll';

      await paymentModel.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // act
      try {
        const payment = await repository.findAll();
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
      }
    });
  });
  
  describe('create', () => {
    it('should create a payment', async () => {
      const id = 'abcd-efgh-create';

      // act
      await repository.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // assert
      const payment = await repository.findOneByOrderId(id);
      expect(payment).not.toBeUndefined();
      expect(payment).not.toBeNull();
    });
  });
  
  describe('update', () => {
    it('should update an payment', async () => {
      // arrange
      const id = 'abcd-efgh-update';

      await paymentModel.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // act
      try {
        const payment = await repository.update(id, {value: 20});
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
      }
    });
  });
  
  describe('delete', () => {
    it('should delete an payment', async () => {
      // arrange
      const id = 'abcd-efgh-delete';

      await paymentModel.create({
        id: id,
        customerId: id,
        orderId: id,
        value: 10,
        paymentType: 'abc',
        status: 'Criado',
        qrCode: 'abc',
        url: 'abc',
      });

      // act
      try {
        const payment = await repository.delete(id);
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
      }
    });
  });
});
