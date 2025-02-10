import { Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlbumService {
  constructor (private readonly prismaService: PrismaService){}

  // 앨범 평가 전체 조회
  async findAll(): Promise<Album[]>{
    return this.prismaService.album.findMany();
  }

  // 앨범 아이디로 조회
  async findOne(albumId: number): Promise<Album | null>{
    return this.prismaService.album.findUnique({
      where: {
        albumId: Number(albumId)
      }
    });
  }

  // 앨범 별점 추가
  async addAlbumScope(album: Album): Promise<Album>{
    return this.prismaService.album.create({
      data: album
    });
  }
  
  // 앨범 별점 수정
  async modifyAlbumScope(albumId: number, albumRate: number): Promise<Album> {
    return this.prismaService.album.update({
      where: {
        albumId: Number(albumId)
      },
      data: {
        albumRate: albumRate
      }
    });
  }

  // 앨범 별점 삭제
  async deleteAlbumScope(albumId: number): Promise<Album>{
    return this.prismaService.album.delete({
      where: {albumId: Number(albumId)}
    });
  }

  // 앨범 한줄평 추가 및 수정
  async saveAlbumReview(albumId: number, albumReview: string | null): Promise<Album> {
    return this.prismaService.album.update({
      where: {
        albumId: Number(albumId)
      },
      data: {
        albumReview: albumReview
      }
    });
  }

  // 앨범 한줄평 삭제
  async deleteAlbumReview(albumId: number): Promise<Album>{
    return this.prismaService.album.update({
      where: {albumId: Number(albumId)},
      data: {
        albumReview: null
      }
    });
  }
}
