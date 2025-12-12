// lemonsqueezy-order.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  Pending = 'pending',
  Failed = 'failed',
  Paid = 'paid',
  Refunded = 'refunded',
  PartialRefund = 'partial_refund',
  Fraudulent = 'fraudulent',
}

class FirstOrderItemDto {
  @IsInt()
  price!: number;

  @IsNotEmpty()
  @IsInt()
  order_id!: number;

  @IsInt()
  quantity!: number;

  @IsBoolean()
  test_mode!: boolean;

  @IsISO8601()
  created_at!: string;

  @IsNotEmpty()
  @IsInt()
  product_id!: number;

  @IsNotEmpty()
  @IsInt()
  variant_id!: number;

  @IsString()
  product_name!: string;

  @IsString()
  variant_name!: string;
}

class AttributesDto {
  @IsInt()
  total!: number;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsNotEmpty()
  @IsInt()
  store_id!: number;

  @IsBoolean()
  test_mode!: boolean;

  @IsString()
  user_name!: string;

  @IsISO8601()
  created_at!: string;

  @IsNotEmpty()
  @IsString()
  user_email!: string;

  @IsInt()
  customer_id!: number;

  @IsInt()
  order_number!: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FirstOrderItemDto)
  first_order_item!: FirstOrderItemDto;
}

class DataDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AttributesDto)
  attributes!: AttributesDto;
}

export default class WebhookOrderCreatedDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DataDto)
  data!: DataDto;
}
