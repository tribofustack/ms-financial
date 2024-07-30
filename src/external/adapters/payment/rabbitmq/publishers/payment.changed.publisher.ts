import { Inject, Injectable } from "@nestjs/common";
import { EXCHANGE } from "src/internal/application/configs/queue";
import {
  IMessageBroker,
  IPaymentPublisher,
} from "src/internal/application/ports/queues/message-broker";

@Injectable()
export class PaymentPublisher implements IPaymentPublisher {
  constructor(
    @Inject("MessageBroker")
    private messageBroker: IMessageBroker,
  ) {}

  async paymentChangedMessage(message: any): Promise<void> {
    await this.messageBroker.publishInExchange({
      exchange: EXCHANGE,
      message: JSON.stringify(message),
      routingKey: `payments.changed`,
    });
  }

  async paymentCanceledMessage(message: any): Promise<void> {
    await this.messageBroker.publishInExchange({
      exchange: EXCHANGE,
      message: JSON.stringify(message),
      routingKey: `payments.canceled`,
    });
  }
}
