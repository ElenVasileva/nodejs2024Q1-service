import { v4 as uuidv4 } from 'uuid';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaClient } from '@prisma/client';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createUserDto: CreateUserDto) {
    const dbUser = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        version: 1,
        ...createUserDto,
      },
    });
    console.log(`user '${dbUser.login}' with id '${dbUser.id}' was created`);
    return User.getSafeUser(User.userFromDB(dbUser));
  }

  async findAll() {
    const list = (await this.prisma.user.findMany()).map((dbUser) => {
      const user: User = User.userFromDB(dbUser);
      return User.getSafeUser(user);
    });
    console.log(`findAll: find ${list.length} users`);
    return list;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      console.log(`findOne: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    return User.getSafeUser(User.userFromDB(user));
  }

  async update(id: string, updateUserDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      console.log(`update: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    if (user.password === updateUserDto.oldPassword) {
      const newUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          ...user,
          updatedAt: new Date(),
          version: user.version + 1,
          password: updateUserDto.newPassword,
        },
      });
      console.log(`password for user '${user.login}' with id '${user.id}' was updated`);
      return User.getSafeUser(User.userFromDB(newUser));
    } else {
      throw new ForbiddenException();
    }
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      console.log(`remove: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    console.log(`remove: user with id '${id}' was deleted`);
  }
}
