import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ApprovePaymentByOrderId } from "./approve-payment.usecase";
import { IPaymentRepository } from "src/internal/domain/payment/repositories/payment.repository";
import { ChangedPaymentStatusEvent } from "src/internal/domain/payment/events/payment-status-changed.event";
import { IEventEmitter } from "../../ports/events/event";
import { Payment } from "src/internal/domain/payment/entities/payment.entity";

describe("ApprovePaymentByOrderId", () => {
  let approvePaymentByOrderId: ApprovePaymentByOrderId;
  let paymentRepositoryMock: jest.Mocked<IPaymentRepository>;
  let eventEmitterMock: jest.Mocked<IEventEmitter>;

  beforeAll(async () => {
    jest.useFakeTimers();
    paymentRepositoryMock = {
      findOneByOrderId: jest.fn(),
      changeStatus: jest.fn(),
    } as unknown as jest.Mocked<IPaymentRepository>;

    eventEmitterMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<IEventEmitter>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovePaymentByOrderId,
        { provide: "PaymentRepository", useValue: paymentRepositoryMock },
        { provide: "EventEmitter", useValue: eventEmitterMock },
      ],
    }).compile();

    approvePaymentByOrderId = module.get<ApprovePaymentByOrderId>(
      ApprovePaymentByOrderId,
    );
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  describe("execute", () => {
    it("should approve the payment and emit events", async () => {
      const orderId = "testOrderId";
      const customerId = "testCustomerId";
      const payment = new Payment({
        id: "paymentId1",
        customerId: customerId,
        orderId: orderId,
        value: 10,
      });
      payment.status = "Pendente de pagamento";

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(payment);

      await approvePaymentByOrderId.execute(orderId);
      jest.advanceTimersByTime(20000);

      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        "payment-status.changed",
        expect.any(ChangedPaymentStatusEvent),
      );
    });

    it("should throw NotFoundException if the payment does not exist", async () => {
      const orderId = "nonExistentOrderId";

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(null);

      await expect(approvePaymentByOrderId.execute(orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
