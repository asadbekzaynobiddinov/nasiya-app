import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { TokenResponse } from 'src/common/interfaces';
import { UserID } from 'src/common/decorator/user-id.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Login or password not found!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You are inactive. Call the store',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful login',
    type: TokenResponse,
  })
  login(
    @Body() authLoginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(authLoginDto, res);
  }

  @ApiOperation({ summary: 'New access token for store' })
  @Get('profile')
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin profile fetched successfully',
  })
  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  profile(@UserID() id: string) {
    return this.authService.findOne(id);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Generate new access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access token generated successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          expire: '24h',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to generate new access token',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on refresh token',
      },
    },
  })
  refreshToken(@CookieGetter('refresh_token_store') refresh_token: string) {
    return this.authService.refreshToken(refresh_token);
  }

  @ApiOperation({ summary: 'Logout store' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store logged out success',
  })
  @Post('logout')
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged out successfully',

    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to log out admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on logout',
      },
    },
  })
  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  logout(
    @CookieGetter('refresh_token_store') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(refresh_token, res);
  }
}
