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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/common/file/file.service';

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

  // 회원가입(비밀번호 암호화까지 구현)
  // 유효성체크(이메일 등..은 client에서 구현 예정)
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

  // 회원 수정
  // 닉네임 유효성 검사는 client에서 구현 예정
  // 기본 이미지로 변경 시 어떻게 처리할 것인가..?는 client 구현 하면서 구현 예정
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', {storage: FileService.multerConfig()}))
  async updateUser(@Body() updateUser: User, @Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<User | null> {
    const existingUser = await this.userService.findOne(id);
    if(!existingUser){
      throw new Error('사용자가 존재하지않습니다.');
    }

    if(file){
      this.userService.deleteImage(existingUser);
      updateUser.userProfileImage = file.path;
    }
    
    return this.userService.updateUser(id, updateUser);
  }

  // 회원 탈퇴
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User | null> {
    const user: User | null = await this.userService.findOne(id);
    if(!user){
      throw new Error('사용자가 존재하지 않습니다.');
    }

    this.userService.deleteImage(user);
    return this.userService.deleteUser(id);
  }
}
