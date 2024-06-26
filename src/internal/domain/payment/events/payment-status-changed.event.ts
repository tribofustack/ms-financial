import { paymentStatusDto } from '../dto/payment-status.dto';

type IConstructorDto = {
  paymentId: string;
  orderId: string;
  status: paymentStatusDto;
};

export class ChangedPaymentStatusEvent {
  constructor(public data: IConstructorDto) {}
}
