import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IPaymentRepository } from "src/internal/domain/payment/repositories/payment.repository";
import { ChangedPaymentStatusEvent } from "src/internal/domain/payment/events/payment-status-changed.event";
import { IEventEmitter } from "../../ports/events/event";
import {
  verifyUuid,
  sanitizeOutput,
  verifyFilePaths,
} from "src/external/infra/utils/validator";

@Injectable()
export class ApprovePaymentByOrderId {
  constructor(
    @Inject("PaymentRepository")
    private paymentRepository: IPaymentRepository,
    @Inject("EventEmitter")
    private eventEmitter: IEventEmitter,
  ) {}

  async execute(orderId: string): Promise<void> {
    verifyUuid(orderId);
    verifyFilePaths(orderId);

    const payment = await this.paymentRepository.findOneByOrderId(orderId);
    if (!payment) throw new NotFoundException("Payment not found");

    console.log("Paying...");

    const paymentApprovedStatus = "Aprovado";
    await this.paymentRepository.changeStatus(
      payment.id,
      paymentApprovedStatus,
    );

    setTimeout(() => {
      this.eventEmitter.emit(
        "payment-status.changed",
        new ChangedPaymentStatusEvent({
          orderId,
          paymentId: sanitizeOutput(payment.id),
          status: paymentApprovedStatus,
          customerId: sanitizeOutput(payment.customerId),
        }),
      );
      console.log("Paid.");
    }, 20000);
  }
}
