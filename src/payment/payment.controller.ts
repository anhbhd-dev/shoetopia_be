import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { format } from 'date-fns';
import * as crypto from 'crypto';

@Controller('api/v1/payment')
export class PaymentController {
  @Post('/create_payment_url')
  async createPaymentUrl(@Req() req: Request, @Res() res: Response) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress;
    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    const returnUrl = process.env.vnp_ReturnUrl;
    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const orderId = format(date, 'HHmmss');
    const amount = req.body.totalAmount;
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription;
    const orderType = 200000;
    let locale = req.body.language;
    if (!locale) {
      locale = 'vn';
    }
    const currCode = 'VND';
    const vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }
    const sortedParams = this.sortObject(vnp_Params);
    const signData = encodeQueryString(sortedParams);
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;
    vnpUrl += `?${encodeQueryString(sortedParams)}`;

    res.json({ vnpUrl });
  }

  private sortObject(obj: any) {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = obj[key];
        return result;
      }, {});
  }
}

function encodeQueryString(obj: { [key: string]: any }): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || typeof value === 'undefined') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`);
      }
    } else {
      let encodedValue = encodeURIComponent(value);
      // Thay thế tất cả các dấu cách bằng dấu '+'
      encodedValue = encodedValue.replace(/%20/g, '+');
      parts.push(`${encodeURIComponent(key)}=${encodedValue}`);
    }
  }

  return parts.join('&');
}
