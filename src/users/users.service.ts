import { v4 as uuidv4 } from 'uuid';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaClient } from '@prisma/client';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  async create(createUserDto: CreateUserDto) {
    const dbUser = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        version: 1,
        ...createUserDto,
      },
    });
    console.log(`user '${dbUser.login}' with id '${dbUser.id}' was created`);
    const user: User = User.userFromDB(dbUser);
    const safeUser = User.getSafeUser(user);
    return safeUser;
  }

  async findAll() {
    return (await this.prisma.user.findMany()).map((dbUser) => {
      const user: User = User.userFromDB(dbUser);
      return User.getSafeUser(user);
    });
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
      return User.getSafeUser(User.userFromDB(newUser));
    } else {
      throw new ForbiddenException();
    }
  }

  async remove(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) {
      console.log(`remove: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    console.log(`remove: user with id '${id}' was deleted`);
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
