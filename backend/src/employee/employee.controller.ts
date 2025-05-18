/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Employee } from './employee.schema';
import { EmployeeCreateDto } from './employee-create.dto';
import { EmployeeService } from './employee.service';
import * as fs from 'fs';
import axios from 'axios';
import { diskStorage } from 'multer';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll(
    @Query()
    query: {
      page?: string;
      limit?: string;
      department?: string;
      title?: string;
      location?: string;
      search?: string;
    },
  ): Promise<{ data: Employee[]; total: number }> {
    const result = await this.employeeService.findAll(query);
    return {
      data: result.data,
      total: result.total,
    };
  }

  @Get('filter-options')
  async getFilterOptions() {
    return this.employeeService.getFilterOptions();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Employee | string> {
    const employee = await this.employeeService.findById(id);
    return employee || `Employee with id ${id} not found`;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  )
  async createEmployee(
    @UploadedFile() file: Express.Multer.File | undefined, // make file optional
    @Body() data: EmployeeCreateDto,
  ) {
    try {
      let imgurUrl = '';

      if (file) {
        const imageBase64 = fs.readFileSync(file.path, { encoding: 'base64' });

        const response = await axios.post(
          'https://api.imgur.com/3/image',
          { image: imageBase64, type: 'base64' },
          {
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
          },
        );

        imgurUrl = response.data.data.link;

        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete local file:', err);
        });
      }

      const employee = await this.employeeService.create({
        ...data,
        avatar: imgurUrl || '',
      });

      return employee;
    } catch (error) {
      console.error('Error uploading to Imgur or saving employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    await this.employeeService.delete(id);
    return `Employee with id ${id} deleted successfully`;
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() employeeCreateDto: any,
  ): Promise<Employee | string> {
    let avatar = employeeCreateDto.avatar;
    if (file) {
      const imageBase64 = fs.readFileSync(file.path, { encoding: 'base64' });

      const response = await axios.post(
        'https://api.imgur.com/3/image',
        { image: imageBase64, type: 'base64' },
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        },
      );

      avatar = response.data.data.link;

      fs.unlink(file.path, (err) => {
        if (err) console.error('Failed to delete local file:', err);
      });
    } else if (employeeCreateDto.removeAvatar === 'true') {
      avatar = '';
    }

    const updated = await this.employeeService.update(id, {
      ...employeeCreateDto,
      avatar,
    });
    return updated || `Employee with id ${id} not found`;
  }
}
