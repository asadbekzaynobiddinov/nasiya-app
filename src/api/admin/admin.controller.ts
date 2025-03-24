import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  HttpException,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { TokenResponse } from 'src/common/interfaces';
import { Public } from 'src/common/decorator/public.decorator';
import { SuperAdminGuard } from 'src/common/guard/super-admin.guard';
import { AdminGuard } from 'src/common/guard/admin.guard';

@ApiTags('Admins')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
  @Public()
  @Post('signin')
  async login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.adminService.login(loginAdminDto, res);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  @ApiCreatedResponse({
    description: 'The admin has been successfully created.',
    type: CreateAdminDto,
  })
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  async create(@Body() adminData: CreateAdminDto): Promise<any> {
    try {
      return this.adminService.create(adminData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create admin.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiOkResponse({
    description: 'List of all admins.',
    type: [CreateAdminDto],
  })
  async findAll(): Promise<any> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiOkResponse({
    description: 'Return the admin data.',
    type: CreateAdminDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found.',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    const data = await this.adminService.findOneById(id);
    if (!data) {
      throw new HttpException('Admin not found.', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update admin data' })
  @ApiOkResponse({
    description: 'The admin has been successfully updated.',
    type: UpdateAdminDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateAdminDto,
  ): Promise<any> {
    return this.adminService.update(id, updateData);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin' })
  @ApiOkResponse({
    description: 'The admin has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found.',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    await this.adminService.delete(id);
    return { message: 'Admin successfully deleted.' };
  }

  @ApiOperation({ summary: 'New access token for admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get new access token success',
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
    description: 'Fail new access token',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on refresh token',
      },
    },
  })
  @Public()
  @Post('refresh-token')
  refreshToken(@CookieGetter('refresh_token_store') refresh_token: string) {
    return this.adminService.refreshToken(refresh_token);
  }

  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged out success',
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
    description: 'Fail on logging out admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on logout',
      },
    },
  })
  // @UseGuards(AuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  logout(
    @CookieGetter('refresh_token_store') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }
}
