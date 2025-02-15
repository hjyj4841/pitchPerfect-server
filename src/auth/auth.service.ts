import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

    // Access Token 발급
    getAccessToken({user}): string {
        return this.jwtService.sign({
            userId: user.userId,
            userName: user.userName
        },
        {
            secret: process.env.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: '1h'
        });
    }

    // RefreshToken 발급
    setRefreshToken({user, res}) {
        const refreshToken = this.jwtService.sign({
            userId: user.userId,
            userName: user.userName
        },
        {
            secret: process.env.REFRESH_TOKEN_SECRET_KEY,
            expiresIn: '2w'
        });
        // 배포 시 쿠키 보안옵션, CORS 추가
        res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
        return;
    }

    // JWT 토큰 검증 (Access Token)
    validateAccessToken(req: Request) {
        const authHeader = req.headers['authorization'];
        if(!authHeader) throw new UnauthorizedException('토큰이 없습니다.');

        const token = authHeader.split(' ')[1];

        try{
            return this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET_KEY
            });
        } catch(error){
            throw new Error('유효하지 않은 토큰입니다.');
        }
    }

    // spotify api token 요청
    async getSpotifyToken(): Promise<string>{
        const authHeader = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
            .toString('base64');
            
        const body = qs.stringify({
            grant_type: 'client_credentials',
        });

        try{
            const response = await axios.post('https://accounts.spotify.com/api/token', body, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authHeader}`,
                },
            });

            return response.data.access_token;
        } catch(err){
            console.error('spotify API Token 요청 중 오류', err);
            throw new Error('spotify API Token 요청 중 오류');
        }
    }
}
