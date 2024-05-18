import { AttributeException, DomainException } from 'src/internal/application/errors';
import { IPayment, Payment } from './payment.entity';

describe('Payment Entity', () => {
  describe('validate', () => {
    it('should validate id', () => {   
      // arrange
      let payment;
      try {
        // act
        payment = new Payment({
          id: null,
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('id not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(payment).toBeFalsy();
    });
    it('should validate customerId', () => {   
      // arrange
      let payment;
      try {
        // act
        payment = new Payment({
          id: 'abc2',
          customerId: null,
          orderId: 'abc2',
          value: 10,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('customerId is required.');
        expect(error).toBeInstanceOf(DomainException);
      }
      expect(payment).toBeFalsy();
    });
    it('should order id', () => {   
      // arrange
      let payment;
      try {
        // act
        payment = new Payment({
          id: 'abc3',
          customerId: 'abc3',
          orderId: null,
          value: 10,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('orderId is required.');
        expect(error).toBeInstanceOf(DomainException);
      }
      expect(payment).toBeFalsy();
    });
    it('should validate value', () => {   
      // arrange
      let payment;
      try {
        // act
        payment = new Payment({
          id: 'abc4',
          customerId: 'abc4',
          orderId: 'abc4',
          value: 0,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('value must be a positive number.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(payment).toBeFalsy();
    });
    it('should validate status Aprovado', () => {   
      // arrange
      try {
        // act
        const payment = new Payment({
          id: 'testId',
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
        payment.changeStatus('Aprovado');
        payment.changeStatus('Cancelado');
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('payment was approved');
        expect(error).toBeInstanceOf(DomainException);
      }
    });
    it('should validate status Cancelado', () => {   
      // arrange
      try {
        // act
        const payment = new Payment({
          id: 'testId',
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
        payment.changeStatus('Cancelado');
        payment.changeStatus('Aprovado');
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('payment was cancelled');
        expect(error).toBeInstanceOf(DomainException);
      }
    });
    it('should validate status Criado', () => {   
      // arrange
      try {
        // act
        const payment = new Payment({
          id: 'testId',
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
        payment.changeStatus('Aprovado');
        payment.changeStatus('Pendente de pagamento');
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('payment was not created');
        expect(error).toBeInstanceOf(DomainException);
      }
    });
    it('should validate status Aprovado', () => {   
      // arrange
      try {
        // act
        const payment = new Payment({
          id: 'testId',
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
        payment.changeStatus('Aprovado');
        payment.changeStatus('Cancelado');
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('payment was approved');
        expect(error).toBeInstanceOf(DomainException);
      }
    });
    it('should validate status Cancelado', () => {   
      // arrange
      try {
        // act
        const payment = new Payment({
          id: 'testId',
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
        payment.changeStatus('Cancelado');
        payment.changeStatus('Aprovado');
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('payment was cancelled');
        expect(error).toBeInstanceOf(DomainException);
      }
    });
    it('should validate status Criado', () => {   
      // arrange
      try {
        // act
        const payment = new Payment({
          id: 'testId',
          customerId: 'abc',
          orderId: 'abc',
          value: 10,
        });
        payment.changeStatus('Criado');
        payment.changeStatus('Aprovado');
        payment.changeStatus('Pendente de pagamento');
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('payment was not created');
        expect(error).toBeInstanceOf(DomainException);
      }
    });
    it('should validate status Criado', () => {   
      // act
      const payment = new Payment({
        id: 'testId',
        customerId: 'abc',
        orderId: 'abc',
        value: 10,
      });
      payment.changeStatus('Criado');
      payment.changeStatus('Pendente de pagamento');
    });
  });
});
