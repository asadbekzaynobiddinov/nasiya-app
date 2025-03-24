import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { Admin } from 'src/core/entity/index';
import { AdminRepository } from 'src/core/repository/index';
import { CreateAdminDto } from './dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { BcryptManage } from 'src/infrastructure/lib/bcrypt';
import { IAdminPayload } from 'src/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';
import { Response } from 'express';

@Injectable()
export class AdminService extends BaseService<
  CreateAdminDto,
  DeepPartial<Admin>
> {
  constructor(
    @InjectRepository(Admin) repository: AdminRepository,
    private readonly bcryptManage: BcryptManage,
    private readonly jwtService: JwtService,
  ) {
    super(repository);
  }

  async create(dto: CreateAdminDto): Promise<{
    status_code: number;
    message: string;
    data: DeepPartial<Admin>;
  }> {
    const currentAdminUsername = await this.getRepository.findOne({
      where: { username: dto.username },
    });
    if (currentAdminUsername) {
      throw new BadRequestException('username already exist!');
    }
    const currentAdminPhone = await this.getRepository.findOne({
      where: { phone_number: dto.phone_number },
    });
    if (currentAdminPhone) {
      throw new BadRequestException('phone number already exist!');
    }
    const hashPassword = await this.bcryptManage.createBcryptPassword(
      dto.hashed_password,
    );
    dto.hashed_password = hashPassword;
    const newAdmin = await this.getRepository.save(dto);
    return {
      status_code: 201,
      message: 'success',
      data: newAdmin,
    };
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
    const currentAdmin = await this.getRepository.findOne({
      where: { username: loginAdminDto.username },
    });
    if (!currentAdmin) {
      throw new NotFoundException('username or password is wrong');
    }

    const isMatch = await this.bcryptManage.comparePassword(
      loginAdminDto.hashed_password,
      currentAdmin.hashed_password,
    );
    if (!isMatch) {
      throw new NotFoundException('username or password is wrong');
    }

    const payload: IAdminPayload = {
      sub: currentAdmin.id,
      username: currentAdmin.username,
      role: currentAdmin.role,
    };

    const accessToken = await this.jwtService.sign(payload, {
      secret: config.ACCESS_TOKEN_KEY,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });

    const refreshToken = await this.jwtService.sign(payload, {
      secret: config.REFRESH_TOKEN_KEY,
      expiresIn: config.REFRESH_TOKEN_TIME,
    });
    await this.writeToCookie(refreshToken, res);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    let data: IAdminPayload;
    try {
      data = await this.jwtService.verify(refreshToken, {
        secret: config.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
    await this.getRepository.findOne({ where: { id: data?.sub } });
    const payload: IAdminPayload = {
      sub: data.sub,
      username: data.username,
      role: data.role,
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
    let data: IAdminPayload;
    try {
      data = await this.jwtService.verify(refresh_token, {
        secret: config.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
    await this.findOneById(data?.sub);
    res.clearCookie('refresh_token_admin');
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  }

  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token_admin', refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  }
}
