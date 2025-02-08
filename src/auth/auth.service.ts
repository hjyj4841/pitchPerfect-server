import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

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
}
