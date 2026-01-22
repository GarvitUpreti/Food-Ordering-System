import { Controller, Get, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('payment-methods')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Create payment method
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto, @GetUser() user: any) {
    return this.paymentsService.createOrUpdate(user.id, createPaymentMethodDto);
  }

  // 2.5 Update payment method - ONLY ADMIN
  @Put()
  @Roles(Role.ADMIN)
  update(@Body() updatePaymentMethodDto: UpdatePaymentMethodDto, @GetUser() user: any) {
    return this.paymentsService.createOrUpdate(user.id, updatePaymentMethodDto);
  }

  // Get my payment method
  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findMine(@GetUser() user: any) {
    return this.paymentsService.findByUser(user.id);
  }

  // Delete payment method
  @Delete()
  @Roles(Role.ADMIN)
  remove(@GetUser() user: any) {
    return this.paymentsService.remove(user.id);
  }
}