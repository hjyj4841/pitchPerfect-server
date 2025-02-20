import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

@Injectable()
export class UserService{
  constructor(private readonly prismaService: PrismaService) {}

  // 이미지 삭제 로직
  async deleteImage(user: User) {
    if(user.userProfileImage){
      try{
        const existingFilePath = user.userProfileImage;
        if(fs.existsSync(existingFilePath)){
          fs.unlinkSync(existingFilePath);
        }
      }catch(error){
        console.error("파일제거중 에러발생: ", error);
      }
    }
  }

  // 전체 조회
  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  // 단일 조회
  async findOne(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { userId: id },
    });
  }

  // 회원가입(비밀번호 암호화까지만 구현, 유효성체크 해야함. 아이디/닉네임 중복 확인)
  async addUser(user: User): Promise<User>{
    user.userPassword = await bcrypt.hash(user.userPassword, 10);
    return this.prismaService.user.create({data: user});
  }

  // 회원삭제
  async deleteUser(id: string): Promise<User | null>{
    return this.prismaService.user.delete({
      where: {userId: id}
    });
  }

  // 회원수정
  async updateUser(id: string, user: User): Promise<User | null>{
    return this.prismaService.user.update({
      where: {userId: id},
      data: {
        userName: user.userName,
        userProfileImage: user.userProfileImage,
        userIntroduce: user.userIntroduce
      }
    });
  }
}
