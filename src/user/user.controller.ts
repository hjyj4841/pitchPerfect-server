import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원 전체 조회
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 회원 단일 조회
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  // 회원 추가
  @Post()
  async addUser(@Body() data: User): Promise<User | null> {
    return this.userService.addUser(data);
  }

  // 회원 삭제
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.deleteUser(id);
  }

  // 회원 수정
  @Put(':id')
  async updateUser(@Body() data: User, @Param('id') id: string): Promise<User | null> {
    return this.userService.updateUser(id, data);
  }
}
