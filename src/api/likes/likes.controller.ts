import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
// import { UpdateLikeDto } from './dto/update-like.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Likes Api')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: 'Create Likes',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created Likes',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {
          store: 'ad2d8258-ca57-4152-bc3b-92b1ff6c8239',
          debtor: '61e27167-0407-4b17-86fe-eff8a0b5b756',
          id: '7ae7675e-0cf2-4865-89ca-242e6bae2be7',
          created_at: '2025-01-24T20:52:50.592Z',
          updated_at: '2025-01-24T20:52:50.592Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to Validate UUID',
    schema: {
      example: {
        status_code: 400,
        error: {
          message: 'debtor must be a UUID',
        },
      },
    },
  })
  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @ApiOperation({
    summary: 'Find all Likes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all Likes',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: '7ae7675e-0cf2-4865-89ca-242e6bae2be7',
            store: 'ad2d8258-ca57-4152-bc3b-92b1ff6c8239',
            debtor: '61e27167-0407-4b17-86fe-eff8a0b5b756',
            created_at: '2025-01-24T20:52:50.592Z',
            updated_at: '2025-01-24T20:52:50.592Z',
          },
          {
            id: 'e92d43ff-1b1f-4f54-8503-34031e803ea6',
            store: 'ad2d8258-ca57-4152-bc3b-92b1ff6c8239',
            debtor: '61e27167-0407-4b17-86fe-eff8a0b5b756',
            created_at: '2025-01-24T20:54:34.368Z',
            updated_at: '2025-01-24T20:54:34.368Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        status_code: 404,
        error: {
          message: 'not found',
        },
      },
    },
  })
  @Get()
  findAll() {
    try {
      return this.likesService.findAll({
        relations: ['store', 'debtor'],
      });
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({
    summary: 'Find One Likes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find One Likes',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '7ae7675e-0cf2-4865-89ca-242e6bae2be7',
          store: 'ad2d8258-ca57-4152-bc3b-92b1ff6c8239',
          debtor: '61e27167-0407-4b17-86fe-eff8a0b5b756',
          created_at: '2025-01-24T20:52:50.592Z',
          updated_at: '2025-01-24T20:52:50.592Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation falied',
    schema: {
      example: {
        status_code: 400,
        error: {
          message: 'Validation failed (uuid is expected)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        status_code: 404,
        error: {
          message: 'not found',
        },
      },
    },
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.likesService.findOneById(id, {
      relations: ['store', 'debtor'],
    });
  }

  @ApiOperation({
    summary: 'Delete Likes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete Likes',
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
    description: 'Validation falied',
    schema: {
      example: {
        status_code: 400,
        error: {
          message: 'Validation failed (uuid is expected)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        status_code: 404,
        error: {
          message: 'not found',
        },
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.likesService.delete(id);
  }
}
