import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DebtDto } from './dto/createDebt-dto';
import { DebtsService } from './debts.service';
import { UpdateDebtDto } from './dto/updateDebt-dto';

@ApiBearerAuth()
@ApiTags('Debts')
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @ApiOperation({ summary: 'Create a new debt' })
  @ApiResponse({
    status: 201,
    description: 'Debt successfully created.',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {
          debt_date: '2025-01-22',
          debt_period: 3,
          debt_sum: 1500.75,
          description: 'Debt for January 2025',
          debtor: 'debtor-12345',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @Post()
  @ApiBody({ type: DebtDto })
  create(@Body() debtDto: DebtDto) {
    return this.debtsService.create(debtDto);
  }

  @ApiOperation({ summary: 'Retrieve all debts' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all debts.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            debt_date: '2025-01-22',
            debt_period: 3,
            debt_sum: 1500.75,
            description: 'Debt for January 2025',
            debtor: 'debtor-12345',
          },
          {
            debt_date: '2025-02-15',
            debt_period: 'MONTH6',
            debt_sum: 3000.5,
            description: 'Debt for February 2025',
            debtor: 'debtor-67890',
          },
        ],
      },
    },
  })
  @ApiQuery({
    name: 'debtor_id',
    required: true,
    type: String,
    description: 'debtor id related to debt',
  })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    description: 'Number of records to retrieve (pagination)',
  })
  @ApiQuery({
    name: 'skip',
    required: true,
    type: Number,
    description: 'Number of records to skip (pagination)',
  })
  @Get()
  findAll(@Query() query: any) {
    return this.debtsService.findAll({
      where: { debtor: { id: query.debtor_id } },
      skip: query.skip,
      take: query.take,
      relations: ['images'],
    });
  }

  @ApiOperation({ summary: 'Retrieve a single debt by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the debt.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          debt_date: '2025-01-22',
          debt_period: 3,
          debt_sum: 1500.75,
          description: 'Debt for January 2025',
          debtor: 'debtor-12345',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Debt not found.',
    schema: {
      example: {
        status_code: 404,
        message: 'Debt with the given ID was not found.',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the debt',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtsService.findOneById(id);
  }

  @ApiOperation({ summary: 'Update a debt by ID' })
  @ApiResponse({
    status: 200,
    description: 'Debt successfully updated.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          debt_date: '2025-01-22',
          debt_period: 3,
          debt_sum: 1500.75,
          description: 'Updated debt description',
          debtor: 'debtor-12345',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Debt not found.',
    schema: {
      example: {
        status_code: 404,
        message: 'Debt with the given ID was not found.',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the debt',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateDebtDto })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStoreDto: UpdateDebtDto,
  ) {
    return this.debtsService.update(id, updateStoreDto);
  }

  @ApiOperation({ summary: 'Delete a debt by ID' })
  @ApiResponse({
    status: 200,
    description: 'Debt successfully deleted.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Debt not found.',
    schema: {
      example: {
        status_code: 404,
        message: 'Debt with the given ID was not found.',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the debt',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtsService.delete(id);
  }
}
