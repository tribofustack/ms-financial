import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { DomainException } from "src/internal/application/errors";
import { CancelPaymentByOrderId } from "./cancel-payment.usecase";
import { IPaymentRepository } from "src/internal/domain/payment/repositories/payment.repository";
import { ChangedPaymentStatusEvent } from "src/internal/domain/payment/events/payment-status-changed.event";
import { IEventEmitter } from "../../ports/events/event";
import { Payment } from "src/internal/domain/payment/entities/payment.entity";

describe("CancelPaymentByOrderId", () => {
  let cancelPaymentByOrderId: CancelPaymentByOrderId;
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
        CancelPaymentByOrderId,
        { provide: "PaymentRepository", useValue: paymentRepositoryMock },
        { provide: "EventEmitter", useValue: eventEmitterMock },
      ],
    }).compile();

    cancelPaymentByOrderId = module.get<CancelPaymentByOrderId>(
      CancelPaymentByOrderId,
    );
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  describe("execute", () => {
    it("should cancel the payment and emit events", async () => {
      const orderId = "testOrderId";
      const payment = new Payment({
        id: "paymentId1",
        customerId: "testCustomerId",
        orderId: orderId,
        value: 10,
      });
      payment.status = "Pendente de pagamento";

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(payment);

      await cancelPaymentByOrderId.execute(orderId);
      jest.advanceTimersByTime(20000);

      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        "payment-status.changed",
        expect.any(ChangedPaymentStatusEvent),
      );
    });

    it("should throw DomainException if the payment was already approved", async () => {
      const orderId = "testOrderId";
      const payment = new Payment({
        id: "paymentId1",
        customerId: "testCustomerId",
        orderId: orderId,
        value: 10,
      });
      payment.status = "Aprovado";

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(payment);

      await expect(cancelPaymentByOrderId.execute(orderId)).rejects.toThrow(
        DomainException,
      );
    });

    it("should throw NotFoundException if the payment does not exist", async () => {
      const orderId = "nonExistentOrderId";

      paymentRepositoryMock.findOneByOrderId.mockResolvedValue(null);

      await expect(cancelPaymentByOrderId.execute(orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
