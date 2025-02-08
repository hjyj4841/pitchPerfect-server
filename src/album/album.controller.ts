import { Controller, Post, Body, Request } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly authService: AuthService
  ) {}

  // 앨범 평가 추가
  @Post('scope')
  async addAlbumScope(@Body() album: Album, @Request() req: Request): Promise<Album>{
    const user = this.authService.validateAccessToken(req);
    album.userId = user.userId;

    return this.albumService.addAlbumScope(album);
  }
}
