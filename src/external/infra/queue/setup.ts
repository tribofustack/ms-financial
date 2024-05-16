import { IMessageBroker } from 'src/internal/application/ports/queues/message-broker';
import {
  EXCHANGE,
  PAYMENT_BINDING_KEY,
  PAYMENT_QUEUE,
} from 'src/internal/application/configs/queue';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePaymentConsumer } from 'src/external/adapters/payment/rabbitmq/consumers/order-created.consumer';

@Injectable()
export class PaymentQueueSetup implements OnModuleInit {
  constructor(
    @Inject('MessageBroker')
    private broker: IMessageBroker,
    @Inject('CreatePaymentConsumer')
    private readonly createPaymentConsumer: CreatePaymentConsumer
  ) {}

  async onModuleInit() {
    try {
      console.time('Start message broker');
      await this.init();
      console.timeEnd('Start message broker');
    }catch(error) {
      console.error(error.message)
    }
  }

  async init(): Promise<IMessageBroker> {       
    await this.broker.connect();
    await this.broker.createExchange(EXCHANGE);
    await this.broker.createQueue(PAYMENT_QUEUE);
    await this.broker.bindQueueInExchange({
      queue: PAYMENT_QUEUE,
      exchange: EXCHANGE,
      bindigKey: PAYMENT_BINDING_KEY,
    });    
    // quando consumir cria o payment
    await this.broker.consume(PAYMENT_QUEUE, (message) => this.createPaymentConsumer.handle(message));
    return this.broker;
  }
}
