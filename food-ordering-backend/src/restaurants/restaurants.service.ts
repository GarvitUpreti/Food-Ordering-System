import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Country } from '../common/enums/country.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: createRestaurantDto,
      include: {
        menuItems: true,
      },
    });
  }

  // BONUS: Location-based filtering
  async findAll(userCountry: Country, userRole: Role) {
    // Admin sees all restaurants
    if (userRole === Role.ADMIN) {
      return this.prisma.restaurant.findMany({
        include: {
          menuItems: {
            where: { isAvailable: true },
          },
        },
      });
    }

    // Managers and Members only see their country's restaurants
    return this.prisma.restaurant.findMany({
      where: { country: userCountry },
      include: {
        menuItems: {
          where: { isAvailable: true },
        },
      },
    });
  }

  async findOne(id: string, userCountry: Country, userRole: Role) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    // BONUS: Check country access
    if (userRole !== Role.ADMIN && restaurant.country !== userCountry) {
      throw new ForbiddenException('Cannot access restaurants from different country');
    }

    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    await this.findOne(id, null, Role.ADMIN); // Only admin can update

    return this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
      include: {
        menuItems: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id, null, Role.ADMIN);

    return this.prisma.restaurant.delete({
      where: { id },
    });
  }
}