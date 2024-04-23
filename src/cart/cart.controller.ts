import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/decorators/user.decorator';
import { User } from 'src/users/users.entity';
import { CartItemDto } from './dtos/cart-item.dto';
import { RemoveCartItemDto } from './dtos/remove-cart-item.dto';

@Controller('api/v1/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCartByUserId(@ExtractUserFromRequest() user: User) {
    return await this.cartService.getCartByUserId(String(user._id));
  }

  @Post('/add-item')
  async addItemToCart(
    @ExtractUserFromRequest() user: User,
    @Body() variationDto: CartItemDto,
  ) {
    return await this.cartService.addProductToCart(
      String(user._id),
      variationDto,
    );
  }

  @Post('/decrease-quantity')
  async decreaseItemQuantity(
    @ExtractUserFromRequest() user: User,
    @Body() variationDto: CartItemDto,
  ) {
    return await this.cartService.decreaseItemQuantity(
      String(user._id),
      variationDto.variationId,
    );
  }

  @Delete('/remove-item')
  async removeItem(
    @ExtractUserFromRequest() user: User,
    @Body() removeCartItemDto: RemoveCartItemDto,
  ) {
    return await this.cartService.removeItemFromCart(
      String(user._id),
      removeCartItemDto.variationId,
    );
  }
  @Put('/clear-cart')
  async clearCart(@ExtractUserFromRequest() user: User) {
    return await this.cartService.clearCart(String(user._id));
  }
}
