import {
  Controller,
  Body,
  Delete,
  Get,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PhoneNumberDto } from './dto/create-phone.dto';
import { UpdatePhoneNumberDto } from './dto/update-phone.sto';
import { PhoneNumbersService } from './phone_numbers.service';

@ApiBearerAuth()
@ApiTags('Phone Numbers Of Debtors')
@Controller('phone-numbers')
export class PhoneNumbersController {
  constructor(private readonly phonService: PhoneNumbersService) {}

  @ApiOperation({ summary: 'Create a new phone number' })
  @ApiResponse({
    status: 201,
    description: 'Phone number successfully created.',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {
          phone_number: '+998901234567',
          debtor: 'debtor-120283',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiBody({ type: PhoneNumberDto })
  @Post()
  create(@Body() phoneDto: PhoneNumberDto) {
    return this.phonService.create(phoneDto);
  }

  @ApiOperation({ summary: 'Get all phone numbers' })
  @ApiResponse({
    status: 200,
    description: 'List of all phone numbers.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: '1',
            phone_number: '+998901234567',
            debtor: 'debtor-120283',
          },
          {
            id: '2',
            phone_number: '+998901234568',
            debtor: 'debtor-120284',
          },
        ],
      },
    },
  })
  @Get()
  findAll() {
    return this.phonService.findAll({ relations: ['debtor'] });
  }

  @ApiOperation({ summary: 'Get a phone number by ID' })
  @ApiResponse({
    status: 200,
    description: 'Phone number found.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '1',
          phone_number: '+998901234567',
          debtor: 'debtor-120283',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Phone number not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the phone number',
    type: 'string',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.phonService.findOneById(id);
  }

  @ApiOperation({ summary: 'Update a phone number by ID' })
  @ApiResponse({
    status: 200,
    description: 'Phone number successfully updated.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '1',
          phone_number: '+998901234567',
          debtor: 'debtor-120283',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Phone number not found.' })
  @ApiBody({ type: UpdatePhoneNumberDto })
  @ApiParam({
    name: 'id',
    description: 'ID of the phone number',
    type: 'string',
  })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhoneDto: UpdatePhoneNumberDto,
  ) {
    return this.phonService.update(id, updatePhoneDto);
  }

  @ApiOperation({ summary: 'Delete a phone number by ID' })
  @ApiResponse({
    status: 200,
    description: 'Phone number successfully deleted.',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Phone number not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the phone number',
    type: 'string',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.phonService.delete(id);
  }
}
