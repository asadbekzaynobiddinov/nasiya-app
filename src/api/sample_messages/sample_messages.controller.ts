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
import { SampleMessagesService } from './sample_messages.service';
import { CreateSampleMessagesDto } from './dto/create-sample_messages.dto';
import { UpdateSampleMessagesDto } from './dto/update-sample_messages.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags()
@ApiBearerAuth()
@Controller('sample/messages')
export class SampleMessagesController {
  constructor(private readonly sampleMessagesService: SampleMessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sample messages' })
  @ApiCreatedResponse({
    description: 'The debtor has been successfully created.',
    type: CreateSampleMessagesDto,
  })
  create(
    @Body() createSampleMessagesDto: CreateSampleMessagesDto,
    @UserID() id: string,
  ) {
    return this.sampleMessagesService.create({
      ...createSampleMessagesDto,
      store: id,
    });
  }

  @ApiOperation({ summary: 'ger all sample messages' })
  @ApiOkResponse({
    description: 'values return in array',
    type: [CreateSampleMessagesDto],
  })
  @Get()
  findAll(@UserID() id: string) {
    return this.sampleMessagesService.findAll({ where: { store: { id } } });
  }

  @ApiOperation({ summary: 'git one sample messages by id' })
  @ApiNotFoundResponse({
    description: 'sample not found',
  })
  @ApiOkResponse({
    description: 'success',
    type: CreateSampleMessagesDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @UserID() store: string) {
    return this.sampleMessagesService.findOneById(id, {
      where: { store: { id: store } },
    });
  }

  @ApiOperation({ summary: 'update one by id' })
  @ApiNotFoundResponse({
    description: 'if you enter wrong id, this error return to you',
  })
  @ApiOkResponse({
    description: 'success',
    type: UpdateSampleMessagesDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSampleMessages: UpdateSampleMessagesDto,
  ) {
    return this.sampleMessagesService.update(id, updateSampleMessages);
  }

  @ApiOperation({ summary: 'delete one by id' })
  @ApiNotFoundResponse({
    description: 'if you enter wrong id, this error return to you',
  })
  @ApiOkResponse({
    description: 'success',
  })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.sampleMessagesService.delete(id);
  }
}
