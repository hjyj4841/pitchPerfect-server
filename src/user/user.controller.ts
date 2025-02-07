import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService) {}

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

  // 회원가입(비밀번호 암호화까지만 구현, 유효성체크 해야함. 아이디/닉네임 중복 확인)
  @Post()
  async addUser(@Body() user: User): Promise<User | null> {
    return this.userService.addUser(user);
  }

  // 로그인
  @Post('login')
  async login(@Body() user: User, @Res() res: Response){
    // 가입한 이메일인지 조회
    const accessUser: User | null = await this.userService.findOne(user.userId);
    if(accessUser === null) throw new UnprocessableEntityException('이메일이 없습니다.');
    
    // 패스워드가 일치한지 조회
    const validatePassowrd: boolean = await bcrypt
      .compare(user.userPassword, accessUser.userPassword);
    if(!validatePassowrd) throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');

    this.userService.setRefreshToken({user, res});
    const jwt = this.userService.getAccessToken({user});

    return res.status(200).send(jwt);
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
