import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { ForbiddenExceptionFilter } from './exceptions/filters/forbidden-exception.filter';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { VariationsModule } from './variations/variations.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { OrdersModule } from './orders/orders.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    ProductsModule,
    ReviewsModule,
    CategoriesModule,
    VariationsModule,
    CartModule,
    UsersModule,
    OrdersModule,
    PaymentMethodsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
