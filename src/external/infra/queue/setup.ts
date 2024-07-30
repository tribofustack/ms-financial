import { IMessageBroker } from "src/internal/application/ports/queues/message-broker";
import {
  EXCHANGE,
  ORDER_BINDING_KEY,
  ORDER_QUEUE,
  PAYMENT_QUEUE,
  PRODUCT_QUEUE,
} from "src/internal/application/configs/queue";
import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CreatePaymentConsumer } from "src/external/adapters/payment/rabbitmq/consumers/order-created.consumer";

@Injectable()
export class PaymentQueueSetup implements OnApplicationBootstrap {
  constructor(
    @Inject("MessageBroker")
    private broker: IMessageBroker,
    @Inject("CreatePaymentConsumer")
    private readonly createPaymentConsumer: CreatePaymentConsumer,
  ) {}

  async onApplicationBootstrap() {
    try {
      console.time("Start message broker");
      setTimeout(async () => this.init(), 20000);
      console.timeEnd("Start message broker");
    } catch (error) {
      console.error("\n deu erro", error.message);
    }
  }

  async init(): Promise<void> {
    await this.broker.connect();
    await this.broker.createExchange(EXCHANGE);
    await this.broker.createQueue(ORDER_QUEUE);
    await this.broker.createQueue(PAYMENT_QUEUE);
    await this.broker.createQueue(PRODUCT_QUEUE);
    await this.broker.bindQueueInExchange({
      queue: ORDER_QUEUE,
      exchange: EXCHANGE,
      bindigKey: ORDER_BINDING_KEY,
    });

    await this.broker.consume(ORDER_QUEUE, (message) =>
      this.createPaymentConsumer.handle(message),
    );
  }
}
