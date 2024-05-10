import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './external/adapters/payment/payment.module';
import DatabaseModule from './external/infra/database';
import QueueModule from './external/infra/queue';
import TokenGeneratorModule from './external/infra/tokens';
import { Jwt } from './external/infra/tokens/jwt/jwt';
@Module({
  imports: [
    PaymentModule,
    QueueModule,
    DatabaseModule,
    TokenGeneratorModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'],
    }),
  ],
  controllers: [],
  providers: [Jwt, { provide: 'TokenGenerator', useExisting: Jwt }],
})
export class AppModule {}
