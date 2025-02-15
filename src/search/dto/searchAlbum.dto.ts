export class SearchAlbumDto {
    albumId: string;
    title: string;
    releaseDate: string;
    albumType: string;
    albumImage: string;
    artists: {artistName: string}[];
    totalTracks: number;
    albumAvgRate: number | undefined; // 총 평가 평균 점수
    albumTotalRate: number | undefined; // 총 평가한 수
    userRate: number | undefined; // 접속한 유저가 평가한 점수
}