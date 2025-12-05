import { Body, Controller, Get, Headers, Post, RawBody } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('order_created')
  onOrderCreated(
    @Body() { data: webhookData }: any,
    // @Req() request: RawBodyRequest<Request>,
    @RawBody() rawBody: Buffer | undefined,
    @Headers() headers: Record<string, string>,
  ): { message: string } {
    console.log({
      signature: headers['x-signature'],
      rawBody: rawBody,
    });
    const signature = Buffer.from(headers['x-signature'] || '', 'utf-8');
    this.appService.onOrderCreated(webhookData, rawBody, signature);
    return { message: 'License created successfully' };
  }
}
