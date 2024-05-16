import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPublisher } from 'src/internal/application/ports/queues/message-broker';
import { ChangedPaymentStatusEvent } from 'src/internal/domain/payment/events/payment-status-changed.event';
import { IPaymentRepository } from 'src/internal/domain/payment/repositories/payment.repository';

@Injectable()
export class ChangePaymentStatusListener {
  constructor(
    @Inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
    @Inject('PaymentPublisher')
    private paymentPublisher: IPublisher
  ) {}

  @OnEvent('payment-status.changed')
  async handle(event: ChangedPaymentStatusEvent) {
    const { paymentId, status } = event.data;
    await this.paymentRepository.changeStatus(paymentId, status);
    // envia mensagem para atualizar status da order
    await this.paymentPublisher.sendMessage(event.data)
  }
}
