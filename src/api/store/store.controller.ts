import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateStoresDto } from './dto/create-store.dto';
import { StoreService } from './store.service';
import { UpdateStoresDto } from './dto/update-store.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { SelfGuard } from 'src/common/guard/self.guard';

@ApiBearerAuth()
@ApiTags('Store API')
@Controller('store')
export class StoreController {
  constructor(private readonly storesService: StoreService) {}
  @ApiOperation({
    summary: 'Create Store',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created store',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          login: 'Asadbek3',
          full_name: 'Asadbek Zaynobiddinov',
          email: 'asdbs@asd.com',
          phone_number: '+998121234578',
          pin_code: 510,
          id: '42c77dbc-8651-487c-99c7-4756364b7762',
          created_at: '2025-01-25T14:19:39.750Z',
          updated_at: '2025-01-25T14:19:39.750Z',
          wallet: '0.00',
          image: '',
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create store',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation error',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create store',
    schema: {
      example: {
        status_code: 400,
        error: {
          message: 'login already exist!',
        },
      },
    },
  })
  @Post()
  @UseGuards(AdminGuard)
  create(@Body() cerateStoresDto: CreateStoresDto) {
    return this.storesService.create(cerateStoresDto);
  }

  @ApiOperation({
    summary: 'Get All Store',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get All store',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: '6b8413ab-84ad-4aa2-950f-09bb38cbc676',
            created_at: '2025-01-25T13:36:03.045Z',
            updated_at: '2025-01-25T13:36:03.045Z',
            login: 'Asadbek',
            wallet: '0.00',
            image: '',
            pin_code: 510,
            is_active: true,
          },
          {
            id: '42c77dbc-8651-487c-99c7-4756364b7762',
            created_at: '2025-01-25T14:19:39.750Z',
            updated_at: '2025-01-25T14:19:39.750Z',
            login: 'Asadbek3',
            wallet: '0.00',
            image: '',
            pin_code: 510,
            is_active: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
    schema: {
      example: {
        message: 'Store is not found!',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  // @UseGuards(SelfGuard)
  @Get('get-store-debts')
  getStoreDebts(
    @UserID() id: string,
    @Query() date: { start_date: Date; end_date: Date },
  ) {
    return this.storesService.findStoreByDate(id, date);
  }

  @Get('one-day-debts')
  getOneDebts(@UserID() id: string, @Query('date') date: Date) {
    return this.storesService.findStoreByDateOne(id, date);
  }

  @Get('payment-days')
  paymentDays(@UserID() id: string) {
    return this.storesService.paymentDays(id);
  }

  // @Get('total-debt')
  // async getTotalDebt(@UserID() storeId: string) {
  //   const result = this.storesService.getTotalSumOfStore(storeId);
  //   return result;
  // }

  // @Get('debtors-count')
  // async getDebtorsCount(@UserID() storeId: string) {
  //   return this.storesService.getDebtorsCountByStore(storeId);
  // }

  // @Get('late-debts')
  // async getLateDebts(@UserID() storeId: string) {
  //   return this.storesService.getLateDebtsCountByStore(storeId);
  // }

  // @UseGuards(SelfGuard)
  @Get('statistics')
  statistics(@UserID() id: string) {
    return this.storesService.storeStatistics(id);
  }

  @ApiOperation({
    summary: 'Get One Store',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get one store',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '42c77dbc-8651-487c-99c7-4756364b7762',
          created_at: '2025-01-25T14:19:39.750Z',
          updated_at: '2025-01-25T14:22:58.559Z',
          login: 'Asadbek3',
          phone_number: '+998991234567',
          wallet: '0.00',
          image: '',
          pin_code: 510,
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
    schema: {
      example: {
        message: 'Store is not found!',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update Store',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update store',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '42c77dbc-8651-487c-99c7-4756364b7762',
          created_at: '2025-01-25T14:19:39.750Z',
          updated_at: '2025-01-25T14:26:05.447Z',
          login: 'Asadbek3',
          phone_number: '+998991234567',
          wallet: '0.00',
          image: '',
          pin_code: 510,
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    schema: {
      example: {
        message: ['Error....'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store is not found',
    schema: {
      example: {
        message: 'Store is not found!',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(SelfGuard)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStoreDto: UpdateStoresDto,
  ) {
    return this.storesService.update(id, updateStoreDto);
  }

  @ApiOperation({
    summary: 'Delete store',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
    schema: {
      example: {
        message: 'Store is not found!',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store Delete',
    schema: {
      example: {
        status: true,
        message: 'successfully deleted',
      },
    },
  })
  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.remove(id);
  }
}
