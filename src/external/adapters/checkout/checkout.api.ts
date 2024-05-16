import { Inject, Injectable } from '@nestjs/common';
import { env } from 'src/internal/application/configs/env';
import { IHttp } from 'src/internal/application/ports/http/http';
import { ICheckoutService } from 'src/internal/application/ports/integrations/checkout';

@Injectable()
export class CheckoutService implements ICheckoutService {
    private checkoutUrl: string;

    constructor(
        @Inject('Http')
        private httpService: IHttp,
    ) {
        this.checkoutUrl = `http://${env.checkoutHost}:${env.checkoutPort}`
    }

    async getOrderById(orderId: string) {
        const url = `${this.checkoutUrl}/orders/${orderId}`
        const { body } = await this.httpService.get({ url })
        return body
    }
}