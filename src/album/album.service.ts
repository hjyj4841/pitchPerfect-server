import { Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlbumService {
  constructor (private readonly prismaService: PrismaService){}

  // 앨범 별점 추가
  async addAlbumScope(album: Album): Promise<Album>{
    return this.prismaService.album.create({
      data: album
    });
  }
  
}
