import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ImagesOfDebtorsService } from './images_of_debtors.service';
import { CreateImagesOfDebtorDto, UpdateImagesOfDebtorDto } from './dto/index';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Images_of_debtors')
@Controller('images-of-debtors')
export class ImagesOfDebtorsController {
  constructor(
    private readonly imagesOfDebtorsService: ImagesOfDebtorsService,
  ) {}

  @ApiOperation({ summary: 'Create a new image for debtors' })
  @ApiResponse({
    status: 201,
    description: 'The image was created successfully!',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {
          id: 'uuid',
          image:
            'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post()
  async create(@Body() imageData: CreateImagesOfDebtorDto): Promise<any> {
    try {
      const data = await this.imagesOfDebtorsService.create(imageData);
      return {
        status_code: HttpStatus.CREATED,
        message: 'success',
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create image',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Get all images' })
  @ApiResponse({
    status: 200,
    description: 'List of all images',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: 'uuid',
            image:
              'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp',
          },
        ],
      },
    },
  })
  @Get()
  async findAll(): Promise<any> {
    const data = await this.imagesOfDebtorsService.findAll();
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data,
    };
  }

  @ApiOperation({ summary: 'Get an image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The image data',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: 'uuid',
          image:
            'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const data = await this.imagesOfDebtorsService.findOneById(id);
    if (!data) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data,
    };
  }

  @ApiOperation({ summary: 'Update image data' })
  @ApiResponse({
    status: 200,
    description: 'The image was successfully updated',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: 'uuid',
          image:
            'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateImagesOfDebtorDto,
  ): Promise<any> {
    const data = await this.imagesOfDebtorsService.update(id, updateData);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data,
    };
  }

  @ApiOperation({ summary: 'Delete an image' })
  @ApiResponse({
    status: 200,
    description: 'The image was successfully deleted',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    await this.imagesOfDebtorsService.delete(id);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: null,
    };
  }
}
