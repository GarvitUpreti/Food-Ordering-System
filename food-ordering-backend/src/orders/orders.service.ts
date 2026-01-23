import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Role } from '../common/enums/role.enum';
import { Country } from '../common/enums/country.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  // 2.2 Create order - ALL ROLES CAN DO THIS
  async create(createOrderDto: CreateOrderDto, userId: string, userCountry: Country) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: createOrderDto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.prisma.order.create({
      data: {
        userId,
        restaurantId: createOrderDto.restaurantId,
        country: restaurant.country,
        status: OrderStatus.CART,
        totalAmount: 0,
      },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  // 2.2 Add food items to order - ALL ROLES CAN DO THIS
  async addItem(orderId: string, addItemDto: AddItemDto, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('This is not your order');
    }

    if (order.status !== OrderStatus.CART) {
      throw new BadRequestException('Cannot modify a placed order');
    }

    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: addItemDto.menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (!menuItem.isAvailable) {
      throw new BadRequestException('Menu item is not available');
    }

    // Check if item already exists in order
    const existingItem = await this.prisma.orderItem.findFirst({
      where: {
        orderId,
        menuItemId: addItemDto.menuItemId,
      },
    });

    let orderItem;

    if (existingItem) {
      // Update quantity
      orderItem = await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + addItemDto.quantity,
        },
        include: {
          menuItem: true,
        },
      });
    } else {
      // Create new item
      orderItem = await this.prisma.orderItem.create({
        data: {
          orderId,
          menuItemId: addItemDto.menuItemId,
          quantity: addItemDto.quantity,
          price: menuItem.price,
        },
        include: {
          menuItem: true,
        },
      });
    }

    // Update order total
    await this.updateOrderTotal(orderId);

    return orderItem;
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus, user: any) {
    // Find the order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Location-based access check (except for Admin)
    if (user.role !== Role.ADMIN && order.country !== user.country) {
      throw new ForbiddenException('You can only manage orders from your country');
    }

    // Can't update cancelled or delivered orders
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot update cancelled or delivered orders');
    }

    // Can't change from CART
    if (order.status === OrderStatus.CART) {
      throw new BadRequestException('Cannot update cart orders. Please checkout first.');
    }

    // Update status
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
      },
    });
  }

  // Update item quantity
  async updateItem(orderId: string, itemId: string, updateItemDto: UpdateItemDto, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('This is not your order');
    }

    if (order.status !== OrderStatus.CART) {
      throw new BadRequestException('Cannot modify a placed order');
    }

    const orderItem = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        quantity: updateItemDto.quantity,
      },
      include: {
        menuItem: true,
      },
    });

    await this.updateOrderTotal(orderId);

    return orderItem;
  }

  // Remove item from order
  async removeItem(orderId: string, itemId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('This is not your order');
    }

    if (order.status !== OrderStatus.CART) {
      throw new BadRequestException('Cannot modify a placed order');
    }

    await this.prisma.orderItem.delete({
      where: { id: itemId },
    });

    await this.updateOrderTotal(orderId);

    return { message: 'Item removed from order' };
  }

  // 2.3 Checkout and pay - ONLY ADMIN & MANAGER CAN DO THIS
  async checkout(orderId: string, userId: string, userRole: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('This is not your order');
    }

    if (order.status !== OrderStatus.CART) {
      throw new BadRequestException('Order already placed');
    }

    if (order.orderItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    if (!order.user.paymentMethod) {
      throw new BadRequestException('No payment method found. Please add a payment method first.');
    }

    // Process payment (mock)
    // In production: integrate with Stripe/PayPal

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PLACED,
      },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  // 2.4 Cancel order - ONLY ADMIN & MANAGER CAN DO THIS
  async cancel(orderId: string, userId: string, userRole: Role, userCountry: Country) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // BONUS: Location-based access control
    if (userRole !== Role.ADMIN && order.country !== userCountry) {
      throw new ForbiddenException('Cannot cancel orders from different country');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order already cancelled');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel delivered order');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  // Get user's orders
  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get all orders (Admin/Manager with country filter)
  async findAll(userRole: Role, userCountry: Country) {
    if (userRole === Role.ADMIN) {
      return this.prisma.order.findMany({
        include: {
          restaurant: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Manager sees only their country's orders
    return this.prisma.order.findMany({
      where: { country: userCountry },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get single order
  async findOne(orderId: string, userId: string, userRole: Role, userCountry: Country) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Members can only see their own orders
    if (userRole === Role.MEMBER && order.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    // Managers can only see orders from their country
    if (userRole === Role.MANAGER && order.country !== userCountry) {
      throw new ForbiddenException('Cannot view orders from different country');
    }

    return order;
  }

  // Helper function to update order total
  private async updateOrderTotal(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    const total = order.orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    return this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: total },
    });
  }
}