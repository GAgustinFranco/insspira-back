import { Module, OnModuleInit } from '@nestjs/common';
import { CategoryModule } from "./categories/category.module";
import { PinModule } from './pins/pins.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { CategorySeeder } from './categories/category.seeder';
import { AuthController } from './auth/auth.controller';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';
import { PlanModule } from './plans/plan.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Payment } from './payments/payment.entity';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PlanSeeder } from './plans/plan.seeder';
import { AdminModule } from './admin/admin.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { ReportModule } from './reports/report.module';
import { PinsSeeder } from './pins/pins-seeder/pins.seed';
import { SeedModule } from './pins/pins-seeder/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // NO uses envFilePath en producción
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        console.log('========================================');
        console.log('🔍 DATABASE_URL:', databaseUrl ? 'FOUND' : 'NOT FOUND');
        console.log('🔍 First 40 chars:', databaseUrl?.substring(0, 40));
        console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
        console.log('========================================');

        // SIEMPRE intenta usar DATABASE_URL primero
        if (databaseUrl) {
          console.log('✅ Connecting with DATABASE_URL');
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}', Payment],
            synchronize: true, // Temporalmente true para crear tablas
            ssl: { rejectUnauthorized: false },
            autoLoadEntities: true,
            logging: true, // Ver queries SQL en logs
          };
        }

        // Fallback a variables individuales SOLO si DATABASE_URL no existe
        console.log('⚠️ FALLBACK: Using individual DB variables');
        const dbConfig = {
          type: 'postgres' as const,
          database: configService.get<string>('DB_NAME'),
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          entities: [__dirname + '/**/*.entity{.ts,.js}', Payment],
          synchronize: true,
          autoLoadEntities: true,
          logging: true,
        };
        
        console.log('DB Config:', {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
        });
        
        return dbConfig;
      },
    }),
    TypeOrmModule.forFeature([Payment]),
    UsersModule,
    AuthModule,
    FilesModule,
    CategoryModule,
    PinModule,
    MercadoPagoModule,
    PlanModule,
    NotificationsModule,
    MaintenanceModule,
    SubscriptionModule,
    ReportModule,
    AdminModule,
    SeedModule
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly plan: PlanSeeder,
    private readonly category: CategorySeeder,
    private readonly pinSeeder: PinsSeeder
  ) {}
  
  async onModuleInit() {
    await this.category.run();
    await this.plan.run();
    await this.pinSeeder.seed();
  }
}