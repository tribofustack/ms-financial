import { Test, TestingModule } from "@nestjs/testing";
import { DomainException } from "src/internal/application/errors";
import { CreatePayment } from "./create-payment.usecase";
import { IPaymentRepository } from "src/internal/domain/payment/repositories/payment.repository";
import { IPaymentIntegration } from "src/internal/application/ports/integrations/payment";
import { IIdentifierGenerator } from "src/internal/application/ports/tokens/id-generator";
import { IEventEmitter } from "../../ports/events/event";

describe("CreatePayment", () => {
  let createPayment: CreatePayment;
  let paymentRepositoryMock: jest.Mocked<IPaymentRepository>;
  let paymentIntegrationMock: jest.Mocked<IPaymentIntegration>;
  let idGeneratorMock: jest.Mocked<IIdentifierGenerator>;
  let eventEmitterMock: jest.Mocked<IEventEmitter>;

  beforeAll(async () => {
    paymentRepositoryMock = {
      create: jest.fn(),
      changeStatus: jest.fn(),
    } as unknown as jest.Mocked<IPaymentRepository>;

    paymentIntegrationMock = {
      createPayment: jest.fn(),
    } as unknown as jest.Mocked<IPaymentIntegration>;

    idGeneratorMock = {
      generate: jest.fn().mockReturnValue("paymentId1"),
    } as unknown as jest.Mocked<IIdentifierGenerator>;

    eventEmitterMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<IEventEmitter>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePayment,
        { provide: "PaymentRepository", useValue: paymentRepositoryMock },
        { provide: "PaymentIntegration", useValue: paymentIntegrationMock },
        { provide: "IdGenerator", useValue: idGeneratorMock },
        { provide: "EventEmitter", useValue: eventEmitterMock },
      ],
    }).compile();

    createPayment = module.get<CreatePayment>(CreatePayment);
  });

  describe("execute", () => {
    it("should create a payment successfully", async () => {
      const order = {
        order: {
          id: "orderId1",
          customerId: "customerId1",
          total: 10,
        },
      };

      const mockQrCode = "mockQrCode";
      const mockUrl = "mockUrl";
      const mockStatus = "pending";

      paymentIntegrationMock.createPayment.mockResolvedValue({
        id: "paymentId1",
        qrCode: mockQrCode,
        url: mockUrl,
        status: mockStatus,
      });

      await createPayment.execute(order);

      expect(paymentRepositoryMock.create).toHaveBeenCalledWith({
        customerId: "customerId1",
        id: "paymentId1",
        orderId: "orderId1",
        qrCode: "mockQrCode",
        status: "Pendente de pagamento",
        url: "mockUrl",
        value: 10,
      });
    });

    it("should throw a DomainException if payment creation fails", async () => {
      const order = {
        id: "orderId1",
        customerId: "customerId1",
        total: 10,
      };

      const mockStatus = "cancelled";

      paymentIntegrationMock.createPayment.mockResolvedValue({
        id: "paymentId1",
        qrCode: "mockQrCode",
        url: "mockUrl",
        status: mockStatus,
      });

      await expect(
        createPayment.execute({
          order: {
            customerId: order.customerId,
            id: order.id,
            total: order.total,
          },
        }),
      ).toBeTruthy();
    });
  });
});
