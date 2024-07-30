import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { IPaymentPublisher } from "src/internal/application/ports/queues/message-broker";
import { ChangedPaymentStatusEvent } from "src/internal/domain/payment/events/payment-status-changed.event";

@Injectable()
export class ChangePaymentStatusListener {
  constructor(
    @Inject("PaymentPublisher")
    private paymentPublisher: IPaymentPublisher,
  ) {}

  @OnEvent("payment-status.changed")
  async handle(event: ChangedPaymentStatusEvent) {
    const { status } = event.data;

    if (status === "Cancelado") {
      // se status for de erro manda mensagem para products increase
      await this.paymentPublisher.paymentCanceledMessage(event.data);
    }
    // envia mensagem para atualizar status da order
    await this.paymentPublisher.paymentChangedMessage(event.data);
  }
}
