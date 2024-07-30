import { Inject, Injectable } from "@nestjs/common";
import {
  IPayment,
  Payment,
} from "src/internal/domain/payment/entities/payment.entity";
import { IPaymentRepository } from "src/internal/domain/payment/repositories/payment.repository";
import { IPaymentIntegration } from "src/internal/application/ports/integrations/payment";
import { IIdentifierGenerator } from "src/internal/application/ports/tokens/id-generator";
import { OrderDto } from "src/internal/domain/payment/dto/order.dto";
import { IEventEmitter } from "../../ports/events/event";
import { ChangedPaymentStatusEvent } from "src/internal/domain/payment/events/payment-status-changed.event";
import { paymentStatusDto } from "src/internal/domain/payment/dto/payment-status.dto";

@Injectable()
export class CreatePayment {
  constructor(
    @Inject("PaymentRepository")
    private paymentRepository: IPaymentRepository,
    @Inject("PaymentIntegration")
    private paymentIntegration: IPaymentIntegration,
    @Inject("IdGenerator")
    private idGenerator: IIdentifierGenerator,
    @Inject("EventEmitter")
    private eventEmitter: IEventEmitter,
  ) {}

  // é executado quando a order é criada e inicia a criação do payment
  async execute({ order }: { order: OrderDto }): Promise<IPayment> {
    const payment = new Payment({
      id: this.idGenerator.generate(),
      customerId: order.customerId,
      orderId: order.id,
      value: order.total,
    });

    let paymentStatus: paymentStatusDto = payment.status;

    const {
      qrCode,
      status: integrationPaymentStatus,
      url,
    } = await this.paymentIntegration.createPayment({
      value: payment.value,
      paymentType: "pix",
    });

    if (integrationPaymentStatus !== "pending") paymentStatus = "Cancelado";
    else paymentStatus = "Pendente de pagamento";

    payment.setQrCode(qrCode);
    payment.setUrl(url);
    payment.changeStatus(paymentStatus);

    await this.paymentRepository.create({
      id: payment.id,
      customerId: payment.customerId,
      orderId: payment.orderId,
      value: payment.value,
      status: paymentStatus,
      url: payment.url,
      qrCode: payment.qrCode,
    });

    this.eventEmitter.emit(
      "payment-status.changed",
      new ChangedPaymentStatusEvent({
        paymentId: payment.id,
        orderId: order.id,
        customerId: payment.customerId,
        status: paymentStatus,
      }),
    );

    return payment;
  }
}
