import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JWTStrategy } from './strategies/jwt.strategy';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    JWTStrategy,
    RefreshJwtGuard,
    RefreshJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
