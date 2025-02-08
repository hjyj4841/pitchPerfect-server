import { Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlbumService {
  constructor (private readonly prismaService: PrismaService){}

  // 앨범 평가 추가
  async addAlbumRate(album: Album){
    
  }
  
}
