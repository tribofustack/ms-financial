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
  });
});
