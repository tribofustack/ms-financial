import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface IPaymentModel {
  id: string;
  customerId: string;
  orderId: string;
  value: number;
  paymentType: string;
  status: string;
  qrCode: string;
  url: string;
}

@Table({
  tableName: 'payments',
  timestamps: true,
})
class PaymentModel extends Model implements IPaymentModel {
  @Column({
    field: 'id',
    primaryKey: true,
    unique: true,
    allowNull: false,
    type: DataType.STRING,
  })
  declare id: string;

  @Column({
    field: 'customer_id',
    allowNull: false,
    type: DataType.STRING,
  })
  declare customerId: string;

  @Column({
    field: 'order_id',
    allowNull: false,
    type: DataType.STRING,
  })
  declare orderId: string;

  @Column({
    field: 'status',
    allowNull: false,
    type: DataType.STRING,
  })
  declare status: string;

  @Column({
    field: 'value',
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare value: number;

  @Column({
    field: 'payment_type',
    allowNull: true,
    type: DataType.STRING,
  })
  declare paymentType: string;

  @Column({
    field: 'qr_code',
    allowNull: true,
    type: DataType.STRING,
  })
  declare qrCode: string;

  @Column({
    field: 'url',
    allowNull: true,
    type: DataType.STRING,
  })
  declare url: string;
}

export { PaymentModel };
