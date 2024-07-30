import { Inject, Injectable } from "@nestjs/common";
import { CreatePayment } from "src/internal/application/useCases/payment";

// cria payment com dados do pedido
@Injectable()
export class CreatePaymentConsumer {
  constructor(
    @Inject("CreatePayment")
    private readonly createPaymentUseCase: CreatePayment,
  ) {}

  async handle(message: any) {
    try {
      console.log("executing createPaymentUseCase", message);
      await this.createPaymentUseCase.execute(message);
    } catch (error) {
      console.error("error on CreatePaymentConsumer:", error.message);
    }
  }
}
