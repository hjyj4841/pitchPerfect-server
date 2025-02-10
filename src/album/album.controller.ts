import { Controller, Post, Body, Request, Put, Get, Param, Req, Delete } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly authService: AuthService
  ) {}

  // 앨범 평가 전체 조회
  @Get()
  async findAll(): Promise<Album[]>{
    return this.albumService.findAll();
  }

  // 앨범 아이디로 조회
  @Get(':id')
  async findOnw(@Param('id') albumId: number): Promise<Album | null>{
    return this.albumService.findOne(albumId);
  }

  // 앨범 별점 평가 추가
  @Post('scope')
  async addAlbumScope(@Body() album: Album, @Request() req: Request): Promise<Album>{
    const user = this.authService.validateAccessToken(req);
    album.userId = user.userId;

    return this.albumService.addAlbumScope(album);
  }

  // 앨범 별점 수정
  @Put('scope/:id')
  async modifyAlbumScope(@Param('id') albumId: number, @Body() body: { albumRate: number }, @Req() req: Request): Promise<Album> {
    const user = this.authService.validateAccessToken(req);
    const album: Album | null = await this.albumService.findOne(albumId);

    if(album === null || album.userId !== user.userId){
      throw new Error;
    }

    return this.albumService.modifyAlbumScope(albumId, body.albumRate);
  }

  // 앨범 별점 삭제
  @Delete('scope/:id')
  async deleteAlbumScope(@Param('id') albumId: number, @Req() req: Request): Promise<Album>{
    const user = this.authService.validateAccessToken(req);
    const album: Album | null = await this.albumService.findOne(albumId);

    if(album === null || album.userId !== user.userId){
      throw new Error;
    }

    return this.albumService.deleteAlbumScope(albumId);
  }

  // 앨범 한줄평 추가 / 수정(한줄평은 앨범 별점 평가 후 가능)
  @Put('review/:id')
  async saveAlbumReview(@Param('id') albumId: number, @Body() body: {albumReview: string}, @Req() req: Request): Promise<Album>{
    const user = this.authService.validateAccessToken(req);
    const album: Album | null = await this.albumService.findOne(albumId);

    if(album === null || album.userId !== user.userId){
      throw new Error;
    }
    const albumReview: string | null = body.albumReview === '' ? null : body.albumReview;

    return this.albumService.saveAlbumReview(albumId, albumReview);
  }

  // 앨범 한줄평 삭제
  @Delete('review/:id')
  async deleteAlbumReview(@Param('id') albumId: number, @Req() req: Request): Promise<Album>{
    const user = this.authService.validateAccessToken(req);
    const album: Album | null = await this.albumService.findOne(albumId);

    if(album === null || album.userId !== user.userId){
      throw new Error;
    }

    return this.albumService.deleteAlbumReview(albumId);
  }
}
