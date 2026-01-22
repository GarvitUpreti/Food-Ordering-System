import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({
      data: createMenuItemDto,
      include: {
        restaurant: true,
      },
    });
  }

  async findAll() {
    return this.prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        restaurant: true,
      },
    });
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
    });
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    await this.findOne(id);

    return this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
      include: {
        restaurant: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}