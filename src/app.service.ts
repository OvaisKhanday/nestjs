import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  onOrderCreated(
    // webhookData: any,
    rawBody: Buffer | undefined,
    signature: Buffer,
  ) {
    // const userEmail = webhookData?.attributes?.user_email;
    console.log({ rawBody });

    if (!rawBody || !signature) throw new BadRequestException();

    const secret = '1234567890';

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

    // if (signature !== lemonSqueezyConstants.signatureSecret) {
    //   throw new UnauthorizedException('Invalid Signature');
    // }

    // const randomLicenseKey = this.generateLicenseKey();
    // const license = new License(randomLicenseKey);

    // await this.em.persistAndFlush(license);
    // await this.emailService.sendLicenseKeyEmail(userEmail, randomLicenseKey);
  }
}
