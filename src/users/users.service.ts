import { v4 as uuidv4, validate } from 'uuid';

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Database } from 'src/database';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      console.log(`login '${createUserDto.login}' or password '${createUserDto.password}' is incorrect`);
      throw new BadRequestException();
    }
    const newUser = {
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createUserDto,
    };
    Database.Users.push(newUser);
    console.log(`user '${newUser.login}' with id '${newUser.id}' was created`);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  findAll() {
    return Database.Users;
  }

  findOne(id: string) {
    if (!validate(id)) {
      console.log(`findOne: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Users.findIndex((user) => {
      return user.id === id;
    });
    if (index === -1) {
      console.log(`findOne: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    return Database.Users[index];
  }

  update(id: string, updateUserDto: UpdatePasswordDto) {
    if (!validate(id) || !updateUserDto.oldPassword || !updateUserDto.newPassword) {
      console.log(`update: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Users.findIndex((user) => {
      return user.id === id;
    });
    if (index === -1) {
      console.log(`update: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    const oldUser = Database.Users[index];
    if (oldUser.password === updateUserDto.oldPassword) {
      oldUser.version++;
      oldUser.updatedAt = Date.now();
      oldUser.password = updateUserDto.newPassword;
      console.log(`password for user '${oldUser.login}' with id '${oldUser.id}' was updated`);
    } else {
      throw new ForbiddenException();
    }
    const { password, ...safeUser } = oldUser;
    return safeUser;
  }

  remove(id: string) {
    if (!validate(id)) {
      console.log(`id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Users.findIndex((user) => {
      return user.id === id;
    });
    if (index === -1) {
      console.log(`remove: user with id '${id}' not found`);
      throw new NotFoundException();
    }
    console.log(`remove: user with id '${id}' was deleted`);
    Database.Users.splice(index, 1);
  }
}
