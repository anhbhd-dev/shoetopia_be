import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Variation } from 'src/variations/variations.entity';
import { VariationsService } from 'src/variations/variations.service';
import { Cart } from './cart.entity';
import { CartRepository } from './cart.repository';
import { CartItemDto } from './dtos/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly variationService: VariationsService,
  ) {}

  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByCondition({ user: userId });
    if (!cart) return this.createNewCart(userId);
    return cart;
  }

  async createNewCart(userId: string): Promise<Cart> {
    return await this.cartRepository.create({ user: userId, items: [] });
  }

  async addProductToCart(userId: string, itemAddedToCartData: CartItemDto) {
    const cart = await this.getCartByUserId(userId);

    const existingVariation: Variation = await this.variationService.findOne(
      itemAddedToCartData.variationId,
    );
    if (!existingVariation) {
      throw new NotFoundException(
        `Variation with id ${itemAddedToCartData.variationId} not found`,
      );
    }

    const index = cart.items.findIndex(
      (item) => String(item.variation?._id) === itemAddedToCartData.variationId,
    );
    if (index !== -1) {
      cart.items[index].quantity += itemAddedToCartData.quantity;

      if (cart.items[index].quantity > existingVariation.availableQuantity)
        throw new BadRequestException(
          `Quantity must be less than or equal to ${existingVariation.availableQuantity}`,
        );
    } else {
      cart.items.push({
        variation: existingVariation,
        quantity: itemAddedToCartData.quantity,
      });
    }
    return this.cartRepository.findByIdAndUpdate(cart._id, cart);
  }

  async decreaseItemQuantity(userId: string, variationId: string) {
    const cart = await this.getCartByUserId(userId);
    const index = cart.items.findIndex(
      (item) => String(item.variation?._id) === variationId,
    );

    if (index === -1) throw new BadRequestException('Item not exists in cart');

    if (index !== -1) {
      cart.items[index].quantity--;
    }
    return this.cartRepository.findByIdAndUpdate(cart._id, cart);
  }

  async removeItemFromCart(userId: string, variationId: string) {
    const cart = await this.getCartByUserId(userId);
    const index = cart.items.findIndex(
      (item) => String(item.variation?._id) === variationId,
    );
    if (index === -1) throw new BadRequestException('Item not exists in cart');
    if (index !== -1) {
      cart.items.splice(index, 1);
    }
    return this.cartRepository.findByIdAndUpdate(cart._id, cart);
  }

  async clearCart(userId: string) {
    const cart = await this.getCartByUserId(userId);
    cart.items = [];
    return this.cartRepository.findByIdAndUpdate(cart._id, cart);
  }
}
