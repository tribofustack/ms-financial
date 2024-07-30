import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { Uuid } from "src/external/infra/tokens/uuid/uuid";
import { PaymentSequelizeRepository } from "./sequelize/payment-sequelize.repository";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SequelizeModule } from "@nestjs/sequelize";
import { PaymentModel } from "./sequelize/payment-model";

import { AxiosHttp } from "src/external/infra/http/axios";
import { RabbitMQ } from "src/external/infra/queue/rabbitmq";
import { ChangePaymentStatusListener } from "./listeners/change-payment-status.listener";
import { PaymentMercadoPago } from "src/external/infra/payment/payment-mercadopago";
import {
  CancelPaymentByOrderId,
  ApprovePaymentByOrderId,
  FindOnePaymentByOrderId,
  CreatePayment,
} from "src/internal/application/useCases/payment";
import { CheckoutService } from "../checkout/checkout.api";
import { PaymentPublisher } from "./rabbitmq/publishers/payment.changed.publisher";
import { CreatePaymentConsumer } from "./rabbitmq/consumers/order-created.consumer";
import { PaymentQueueSetup } from "src/external/infra/queue/setup";

@Module({
  imports: [SequelizeModule.forFeature([PaymentModel])],
  controllers: [PaymentController],
  providers: [
    Uuid,
    PaymentSequelizeRepository,
    AxiosHttp,
    PaymentMercadoPago,
    ChangePaymentStatusListener,
    CancelPaymentByOrderId,
    ApprovePaymentByOrderId,
    FindOnePaymentByOrderId,
    CreatePayment,
    CheckoutService,
    PaymentPublisher,
    RabbitMQ,
    CreatePaymentConsumer,
    PaymentQueueSetup,
    { provide: "MessageBroker", useExisting: RabbitMQ },
    { provide: "IdGenerator", useExisting: Uuid },
    { provide: "PaymentRepository", useExisting: PaymentSequelizeRepository },
    { provide: "Http", useExisting: AxiosHttp },
    { provide: "PaymentIntegration", useExisting: PaymentMercadoPago },
    { provide: "EventEmitter", useExisting: EventEmitter2 },
    { provide: "CheckoutService", useExisting: CheckoutService },
    { provide: "PaymentPublisher", useExisting: PaymentPublisher },
    { provide: "CreatePayment", useExisting: CreatePayment },
    { provide: "CreatePaymentConsumer", useExisting: CreatePaymentConsumer },
  ],
})
export class PaymentModule {}
