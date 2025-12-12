import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBody,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import WebhookOrderCreatedDto from './dto/webhook-order-created-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('order_created')
  onOrderCreated(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: WebhookOrderCreatedDto,
    // @Req() request: RawBodyRequest<Request>,
    @RawBody() rawBody: Buffer | undefined,
    @Headers() headers: Record<string, string>,
  ): { message: string } {
    console.log({
      signature: headers['x-signature'],
      rawBody: rawBody,
    });
    const signature = Buffer.from(headers['x-signature'] || '', 'utf-8');
    this.appService.onOrderCreated(body, rawBody, signature);
    return { message: 'License created successfully' };
  }
}
