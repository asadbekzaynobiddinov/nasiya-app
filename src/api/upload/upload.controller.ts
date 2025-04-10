import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Upload API')
@Controller('upload')
export class UploadController {
  @Post()
  @ApiOperation({
    summary: 'Upload files',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Files successfully uploaded',
    schema: {
      example: [
        {
          originalname: 'image1.jpg',
          filename: '1676372639291-ks8asjk.jpg',
          path: 'http://localhost:3000/static/1676372639291-ks8asjk.jpg',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Only JPEG, JPG, PNG, SVG formats can be uploaded',
        error: 'Bad Request',
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
        const fileExt = extname(file.originalname).toLowerCase();
        try {
          if (!allowedExtensions.includes(fileExt)) {
            throw new BadRequestException(
              `Only JPEG, JPG, PNG, SVG formats can be uploaded`,
            );
          }
          callback(null, true);
        } catch (error) {
          callback(error, false);
        }
      },
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const data = files.map((file) => ({
        originalname: file.originalname,
        filename: file.filename,
        path: `http://localhost:3000/static/${file.filename}`,
      }));

      return {
        status_code: 200,
        message: 'success',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
