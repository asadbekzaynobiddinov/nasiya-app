import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { DebtorService } from './debtor.service';
import { UserID } from 'src/common/decorator/user-id.decorator';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ESearchBy } from 'src/common/enum';
import { ILike } from 'typeorm';

@ApiTags('Debtor')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('debtor')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debtor' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiCreatedResponse({
    description: 'The debtor has been successfully created.',
    type: CreateDebtorDto,
  })
  create(@Body() createDebtorDto: CreateDebtorDto, @UserID() id: string) {
    return this.debtorService.create({ ...createDebtorDto, store: id });
  }

  //find all

  @Get()
  @ApiOperation({ summary: 'Get all debtors' })
  @ApiOkResponse({
    description: 'Return all debtors.',
    type: [CreateDebtorDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
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
  findAll(@UserID() id: string, @Query() query: any) {
    try {
      return this.debtorService.findAll({
        where: {
          store: { id },
        },
        take: query.take,
        skip: query.skip,
        relations: ['phone_numbers', 'images', 'debts'],
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  //search
  @Get('search')
  @ApiOperation({ summary: 'Get all debtors' })
  @ApiOkResponse({
    description: 'Return all debtors.',
    type: [CreateDebtorDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiQuery({
    name: 'search_by',
    required: true,
    description: `find user's full_name or phone_number`,
    enum: ESearchBy,
  })
  @ApiQuery({
    name: 'search',
    required: true,
    description: "Search term for the user's full name (LIKE search)",
  })
  @ApiQuery({
    name: 'order_by',
    required: true,
    description: 'Sorting order (e.g., "ASC" or "DESC")',
    enum: ['ASC', 'DESC'],
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
  searchDebtor(@UserID() id: string, @Query() query: any) {
    try {
      if (query.search_by === ESearchBy.FULL_NAME) {
        return this.debtorService.findAll({
          order: { full_name: query.order_by },
          where: {
            store: { id }, // store shartini saqlash
            full_name: ILike(`%${query.search}%`), // full_name bo‘yicha katta-kichik harfni farqlamaslik
          },
          take: query.take,
          skip: query.skip,
          relations: ['phone_numbers', 'images', 'debts'],
        });
      }

      if (query.search_by === ESearchBy.PHONE_NUMBER) {
        return this.debtorService.getRepository
          .createQueryBuilder('debtor')
          .leftJoinAndSelect('debtor.phone_numbers', 'phone_numbers_of_debtor') // phone_numbers bilan bog'lash
          .where('debtor.store = :store', { store: id }) // store sharti
          .andWhere('phone_numbers_of_debtor.phone_number LIKE :search', {
            search: `%${query.search}%`,
          }) // phone_numbers ichida LIKE qidiruv
          .orderBy('phone_numbers_of_debtor.phone_number', query.order_by) // phone_numbers bo‘yicha saralash
          .skip(query.skip) // pagination uchun skip
          .take(query.take) // pagination uchun phone_number
          .getMany();
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a debtor by ID' })
  @ApiOkResponse({
    description: 'Return the debtor.',
    type: CreateDebtorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Debtor not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) DebtorId: string, @UserID() id: string) {
    return this.debtorService.findOneById(DebtorId, {
      where: { id: id },
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a debtor by ID' })
  @ApiOkResponse({
    description: 'The debtor has been successfully updated.',
    type: UpdateDebtorDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Debtor not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDebtorDto: UpdateDebtorDto,
  ) {
    return this.debtorService.update(id, updateDebtorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a debtor by ID' })
  @ApiOkResponse({
    description: 'The debtor has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Debtor not found.',
  })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtorService.delete(id);
  }
}
