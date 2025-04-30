import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessagesDto } from './dto/create-messages.dto';
import { UpdateMessagesDto } from './dto/update-messages.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createMessagesDto: CreateMessagesDto, @UserID() id: string) {
    return this.messagesService.create({ ...createMessagesDto, store_id: id });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all messages' })
  @ApiResponse({ status: 200, description: 'List of all messages' })
  getAll(@UserID() id: string) {
    return this.messagesService.findAll({ where: { store: { id } } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a message by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  getOne(@Param('id', ParseUUIDPipe) id: string, @UserID() StoreId: string) {
    return this.messagesService.findOneById(id, {
      where: { store: { id: StoreId } },
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a message by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the message to be updated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Message updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMessagesDto: UpdateMessagesDto,
  ) {
    return this.messagesService.update(id, updateMessagesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the message to be deleted',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.delete(id);
  }
}
