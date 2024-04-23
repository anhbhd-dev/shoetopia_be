import { User } from 'src/users/users.entity';

export class CartResponseDto {
  _id: string;
  userId: User;
  items: any[];
  total: number;
}
