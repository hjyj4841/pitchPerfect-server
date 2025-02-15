import { Injectable } from '@nestjs/common';
import { SearchAlbumDto } from './dto/searchAlbum.dto';
import axios from 'axios';

@Injectable()
export class SearchService {

    async searchAlbumByTitle(title: string, offset: number, limit: number, token: string){
        const albums = await axios.get(`https://api.spotify.com/v1/search?q=${title}&type=album&offset=${offset}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let searchAlbums: SearchAlbumDto[] = [];

        albums.data.albums.items.map(item => {

            let artists: {artistName: string}[] = [];
            item.artists.forEach(artist => {
                artists.push({artistName: artist.name});
            });

            let searchAlbum: SearchAlbumDto = {
                albumId: item.id,
                title: item.name,
                releaseDate: item.release_date,
                albumType: item.album_type,
                albumImage: item.images[0].url,
                artists: artists,
                totalTracks: item.total_tracks,
                albumAvgRate: undefined, // 추가
                albumTotalRate: undefined, // 추가
                userRate: undefined, // 추가
            };

            searchAlbums.push(searchAlbum);
        });

        return searchAlbums;
    }
}
