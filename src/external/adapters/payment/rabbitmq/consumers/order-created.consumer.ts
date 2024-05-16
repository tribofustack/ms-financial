import { Inject, Injectable } from '@nestjs/common';
import { CreatePayment } from 'src/internal/application/useCases/payment';

// cria payment com dados do pedido
@Injectable()
export class CreatePaymentConsumer {
    constructor(
        @Inject('CreatePayment')
        private readonly createPaymentUseCase: CreatePayment
    ) {}
    
    async handle(message: any) {
        console.log('\n', message ,'\n')
        await this.createPaymentUseCase.execute(message)
    }
}