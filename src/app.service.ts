/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import WebhookOrderCreatedDto from './dto/webhook-order-created-dto';
import { StandardCheckoutClient, Env } from 'pg-sdk-node';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  onOrderCreated(
    webhookData: WebhookOrderCreatedDto,
    rawBody: Buffer | undefined,
    signature: Buffer,
  ) {
    // const userEmail = webhookData?.attributes?.user_email;
    console.log({ rawBody });

    if (!rawBody || !signature) throw new BadRequestException();

    if (!webhookData || !rawBody || !signature) throw new BadRequestException();

    const userEmail = webhookData.data.attributes.user_email;
    const storeId = webhookData.data.attributes.store_id;
    const productId = webhookData.data.attributes.first_order_item.product_id;
    const variantId = webhookData.data.attributes.first_order_item.variant_id;

    if (!userEmail) {
      throw new BadRequestException('Email not found');
    }

    if (!storeId || !variantId) {
      throw new BadRequestException('Product Details not found');
    }

    if (storeId !== 243407 || productId != 693993 || variantId !== 1092006) {
      throw new BadRequestException('Payment was not for Taillens product');
    }

    const secret = '1234567890';

    console.log('product is valid');
    console.log({
      userEmail,
      storeId,
      productId,
      variantId,
    });

    const hmac = createHmac('sha256', secret);
    const digest = Buffer.from(
      hmac.update(new Uint8Array(rawBody)).digest('hex'),
      'utf-8',
    );

    console.log({
      digest: new Uint8Array(digest),
      signature: new Uint8Array(signature),
    });

    if (!timingSafeEqual(new Uint8Array(digest), new Uint8Array(signature))) {
      console.log("Didn't match");
      throw new UnauthorizedException('Invalid Signature');
    }

    console.log('Matched');

    // if (signature !== lemonSqueezyConstants.signatureSecret) {
    //   throw new UnauthorizedException('Invalid Signature');
    // }

    // const randomLicenseKey = this.generateLicenseKey();
    // const license = new License(randomLicenseKey);

    // await this.em.persistAndFlush(license);
    // await this.emailService.sendLicenseKeyEmail(userEmail, randomLicenseKey);
  }

  onPhonePeOrderCreated(authHeaderSha: string, responseBody: any) {
    const PHONEPE_CLIENT_ID = 'M22AKECRVM1N6_2512121518';
    const PHONEPE_CLIENT_SECRET =
      'OTU3NTVjZWItYWUzMy00ODVjLTk4ODItNzhkMTUzNGUxZDdj';
    const username = 'ovaisTest';
    const password = 'password1234';

    console.log('#################### PHONEPE WEBHOOK ####################');
    const rawResponseString = JSON.stringify(responseBody);

    console.log({
      authHeaderSha,
      responseBody,
      rawResponseString,
    });

    const client = StandardCheckoutClient.getInstance(
      PHONEPE_CLIENT_ID,
      PHONEPE_CLIENT_SECRET,
      1,
      Env.SANDBOX,
    );

    const callbackResponse = client.validateCallback(
      username,
      password,
      authHeaderSha,
      rawResponseString,
    );
    const orderId = callbackResponse.payload.orderId;
    const state = callbackResponse.payload.state;

    console.log({
      orderId,
      state,
      payload: callbackResponse.payload,
      type: callbackResponse.type,
    });

    console.log('#################### END ####################');
  }
}
