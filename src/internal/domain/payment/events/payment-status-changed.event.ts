import { paymentStatusDto } from "../dto/payment-status.dto";
// import { IPayment } from "../entities/payment.entity";

type IConstructorDto = {
  paymentId: string;
  orderId: string;
  customerId: string;
  // payment: IPayment;
  status: paymentStatusDto;
};

export class ChangedPaymentStatusEvent {
  constructor(public data: IConstructorDto) {}
}
