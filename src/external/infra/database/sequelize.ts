import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseException } from 'src/internal/application/errors';
import { connection } from './connections';
import { PaymentModel } from 'src/external/adapters/payment/sequelize/payment-model';

export const sequelizeModels = [PaymentModel];

export const sequelizeModule = SequelizeModule.forRoot({
  ...connection,
  models: sequelizeModels,
} as SequelizeModuleOptions);

let sequelize: Sequelize | null;

export const initDatabase = async () => {
  sequelize = new Sequelize(connection as SequelizeModuleOptions);

  await sequelize.authenticate({ logging: false });

  sequelize.addModels(sequelizeModels);
  await sequelize.sync({ force: true });

  return sequelize;
};

export const closeDatabase = async (): Promise<void> => {
  if (!sequelize) {
    throw new DatabaseException('Sequelize connection not exists.');
  }

  await sequelize.close();
  sequelize = null;
};
