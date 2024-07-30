export interface ICheckoutService {
  getOrderById(orderId: string): Promise<any>;
}
