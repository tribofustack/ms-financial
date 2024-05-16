import { Inject, Injectable } from '@nestjs/common';
import { Payment } from 'src/internal/domain/payment/entities/payment.entity';
import { IPaymentRepository } from 'src/internal/domain/payment/repositories/payment.repository';
import { IPaymentIntegration } from 'src/internal/application/ports/integrations/payment';
import { IIdentifierGenerator } from 'src/internal/application/ports/tokens/id-generator';
import { DomainException } from 'src/internal/application/errors';
import { OrderDto } from 'src/internal/domain/payment/dto/order.dto';

@Injectable()
export class CreatePayment {
    constructor(
        @Inject('PaymentRepository')
        private paymentRepository: IPaymentRepository,
        @Inject('PaymentIntegration')
        private paymentIntegration: IPaymentIntegration,
        @Inject('IdGenerator')
        private idGenerator: IIdentifierGenerator,
    ) { }

    // é executado quando a order é criada e inicia a criação do payment
    async execute(order: OrderDto): Promise<void> {
        const payment = new Payment({
            id: this.idGenerator.generate(),
            customerId: order.customerId,
            orderId: order.id,
            value: order.total,
        });

        const { qrCode, status, url } = await this.paymentIntegration.createPayment({
            value: payment.value,
            paymentType: 'pix',
        });

        if (status !== 'pending')
            throw new DomainException('Payment was cancelled');

        payment.setQrCode(qrCode);
        payment.setUrl(url);
        payment.changeStatus('Pendente de pagamento');

        await this.paymentRepository.create(payment);
    }
}
