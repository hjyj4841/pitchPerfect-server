import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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

  // 회원 추가
  async addUser(data: User): Promise<User>{
    return this.prismaService.user.create({data: data});
  }

  // 회원삭제
  async deleteUser(id: string): Promise<User | null>{
    return this.prismaService.user.delete({
      where: {userId: id}
    });
  }

  // 회원수정
  async updateUser(id: string, data: User): Promise<User | null>{
    return this.prismaService.user.update({
      where: {userId: id},
      data: {
        userName: data.userName,
        userProfileImage: data.userProfileImage,
        userIntroduce: data.userIntroduce
      }
    });
  }
}
