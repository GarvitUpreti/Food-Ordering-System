import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private encrypt(text: string): string {
    // Simple encryption (use proper library in production like @aws-crypto/client-node)
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // 2.5 Create/Update payment method - ONLY ADMIN CAN DO THIS
  async createOrUpdate(userId: string, dto: CreatePaymentMethodDto | UpdatePaymentMethodDto) {
    const existing = await this.prisma.paymentMethod.findUnique({
      where: { userId },
    });

    const data = {
      userId,
      cardNumber: dto.cardNumber ? dto.cardNumber.slice(-4) : undefined, // Store only last 4 digits
      cardHolderName: dto.cardHolderName,
      expiryDate: dto.expiryDate,
      cvv: dto.cvv ? this.encrypt(dto.cvv) : undefined,
    };

    // Remove undefined values
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    if (existing) {
      return this.prisma.paymentMethod.update({
        where: { userId },
        data,
        select: {
          id: true,
          cardNumber: true,
          cardHolderName: true,
          expiryDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return this.prisma.paymentMethod.create({
      data: data as any,
      select: {
        id: true,
        cardNumber: true,
        cardHolderName: true,
        expiryDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUser(userId: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { userId },
      select: {
        id: true,
        cardNumber: true,
        cardHolderName: true,
        expiryDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return paymentMethod;
  }

  async remove(userId: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    await this.prisma.paymentMethod.delete({
      where: { userId },
    });

    return { message: 'Payment method removed successfully' };
  }
}
