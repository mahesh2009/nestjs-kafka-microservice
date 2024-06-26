import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
        {
            name: 'KAFKA_SERVICE',
            useFactory: async (configService: ConfigService) => ({
                imports: [ConfigModule, ConfigService],
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: configService.get<string>('clientId'),
                        brokers: [configService.get<string>('brokers')],
                    },
                    consumer: {
                        groupId: configService.get<string>('groupId'),
                    },
                },
            }),
            inject: [ConfigService],
        }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
