import { Controller, Get, Query, Request } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthService } from 'src/auth/auth.service';
import { SearchAlbumDto } from './dto/searchAlbum.dto';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly authService: AuthService,
  ) {}

  @Get('title')
  async searchAlbumByTitle(@Query('title') title: string, @Query('offset') offset: number, 
      @Query('limit') limit: number, @Request() req: Request){
    if(req.headers['authorization'] === undefined){
      console.log('로그인 하지 않은상태');
    } else{
      console.log('로그인 된 상태');
      const user = this.authService.validateAccessToken(req);
      console.log(user.userId);
    }

    const token: string = await this.authService.getSpotifyToken();
    return this.searchService.searchAlbumByTitle(title, offset, limit, token);
  }
}
