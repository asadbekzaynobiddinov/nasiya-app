import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Payment Api')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Find All Payments',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find All Payments',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: '7864999c-50fc-45ef-b7cb-cc6138544ed5',
            created_at: '2025-01-23T19:46:26.009Z',
            updated_at: '2025-01-23T19:46:26.009Z',
            sum: '300.00',
            date: '2025-01-23',
            type: 'one_month',
          },
          {
            id: 'de04020e-6300-4be6-a0d1-9aa886d447cc',
            created_at: '2025-01-23T19:48:11.113Z',
            updated_at: '2025-01-23T19:48:11.113Z',
            sum: '300.00',
            date: '2025-01-23',
            type: 'one_month',
          },
        ],
      },
    },
  })
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiOperation({
    summary: 'Find One Payment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find One Payment',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: 'f17c8dab-0058-4202-91d1-77ebf989ecd1',
          created_at: '2025-01-24T09:25:43.175Z',
          updated_at: '2025-01-24T09:25:43.175Z',
          sum: '500.00',
          date: '2025-01-24',
          type: 'one_month',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to Validate UUID',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Update Payment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated Payment',
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
    description: 'Failed to Validate UUID',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiOperation({
    summary: 'Delete Payment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted Payment',
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
    description: 'Failed to Validate UUID',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Payment not found',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.delete(id);
  }

  @Post('for-month')
  async forMonth(
    @Body() forMonthPayment: CreatePaymentDto,
    @Query() query: any,
  ) {
    return this.paymentService.forMonth(forMonthPayment, query);
  }

  @Post('for-any-sum')
  async forAnySum(@Body() forAnySumPayment: CreatePaymentDto) {
    return this.paymentService.forAnySum(forAnySumPayment);
  }
}
