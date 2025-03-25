import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { StoreService } from '../store/store.service';
import { BcryptManage } from '../../infrastructure/lib/bcrypt/index';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from '../../common/interfaces/index';
import { config } from '../../config/index';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly storeService: StoreService,
    private readonly bcryptManage: BcryptManage,
    private readonly jwtService: JwtService,
  ) {}
  async login(authLoginDto: AuthLoginDto, res: Response) {
    const currentStore = await this.storeService.findByLogin(
      authLoginDto.login,
    );
    if (!currentStore) {
      throw new BadRequestException('login or password is wrong');
    }
    const isMatch = await this.bcryptManage.comparePassword(
      authLoginDto.hashed_password,
      currentStore.data.hashed_password,
    );
    if (!isMatch) {
      throw new BadRequestException('login or password is wrong');
    }
    if (!currentStore.data.is_active) {
      throw new ForbiddenException(`You are inactive. Call the admin`);
    }
    const payload: IPayload = {
      sub: currentStore.data.id,
      login: currentStore.data.login,
      is_active: currentStore.data.is_active,
    };
    const accessToken = await this.jwtService.sign(payload, {
      secret: config.ACCESS_TOKEN_KEY,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: config.REFRESH_TOKEN_KEY,
      expiresIn: config.REFRESH_TOKEN_TIME,
    });

    this.writeToCookie(refreshToken, res);
    return {
      accessToken,
      refreshToken,
      store: currentStore.data,
    };
  }

  findOne(id: string) {
    return this.storeService.findOne(id);
  }

  async refreshToken(refreshToken: string) {
    let data: IPayload;
    try {
      data = await this.jwtService.verify(refreshToken, {
        secret: config.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
    await this.storeService.findOne(data?.sub);
    const payload: IPayload = {
      sub: data.sub,
      login: data.login,
      is_active: data.is_active,
    };
    let access_token: any;
    try {
      access_token = await this.jwtService.signAsync(payload, {
        secret: config.ACCESS_TOKEN_KEY,
        expiresIn: config.ACCESS_TOKEN_TIME,
      });
    } catch (error) {
      throw new BadRequestException(`Error on generate access token: ${error}`);
    }
    return {
      status_code: 200,
      message: 'success',
      data: {
        token: access_token,
        expire: config.ACCESS_TOKEN_TIME,
      },
    };
  }

  async logout(refresh_token: string, res: Response) {
    let data: IPayload;
    try {
      data = await this.jwtService.verify(refresh_token, {
        secret: config.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
    await this.storeService.findOne(data?.sub);
    res.clearCookie('refresh_token_store');
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  }

  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token_store', refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  }
}
