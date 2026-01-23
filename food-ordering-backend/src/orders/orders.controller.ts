import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 2.2 Create order - ALL ROLES
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: any) {
    return this.ordersService.create(createOrderDto, user.id, user.country);
  }

  // 2.2 Add items to order - ALL ROLES
  @Post(':id/items')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  addItem(
    @Param('id') id: string,
    @Body() addItemDto: AddItemDto,
    @GetUser() user: any,
  ) {
    return this.ordersService.addItem(id, addItemDto, user.id);
  }

  // Update item quantity
  @Patch(':id/items/:itemId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @GetUser() user: any,
  ) {
    return this.ordersService.updateItem(id, itemId, updateItemDto, user.id);
  }

  // Remove item from order
  @Delete(':id/items/:itemId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @GetUser() user: any,
  ) {
    return this.ordersService.removeItem(id, itemId, user.id);
  }

  // 2.3 Checkout and pay - ONLY ADMIN & MANAGER
  @Post(':id/checkout')
  @Roles(Role.ADMIN, Role.MANAGER)
  checkout(@Param('id') id: string, @GetUser() user: any) {
    return this.ordersService.checkout(id, user.id, user.role);
  }

  // 2.4 Cancel order - ONLY ADMIN & MANAGER
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  cancel(@Param('id') id: string, @GetUser() user: any) {
    return this.ordersService.cancel(id, user.id, user.role, user.country);
  }

  // Get my orders
  @Get('my-orders')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findMyOrders(@GetUser() user: any) {
    return this.ordersService.findUserOrders(user.id);
  }

  // Get all orders (Admin/Manager)
  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll(@GetUser() user: any) {
    return this.ordersService.findAll(user.role, user.country);
  }

  // Get single order
  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.ordersService.findOne(id, user.id, user.role, user.country);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @GetUser() user: any,
  ) {
    return this.ordersService.updateOrderStatus(id, updateStatusDto.status, user);
  }

}