/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee')
    private employeeModel: Model<EmployeeDocument>,
  ) {}

  async findAll(query: any): Promise<{ data: Employee[]; total: number }> {
    const filter: any = {};

    if (query.department) {
      filter.department = { $regex: query.department, $options: 'i' };
    }
    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }
    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    if (query.search && query.search.trim() !== '') {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.employeeModel.find(filter).skip(skip).limit(limit).exec(),
      this.employeeModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employeeModel.findById(id).exec();
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    const newEmployee = new this.employeeModel(data);
    return newEmployee.save();
  }

  async delete(id: string): Promise<Employee | null> {
    return this.employeeModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    return this.employeeModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteAll() {
    return this.employeeModel.deleteMany({});
  }

  async getFilterOptions() {
    const departments = await this.employeeModel.distinct('department');
    const titles = await this.employeeModel.distinct('title');
    const locations = await this.employeeModel.distinct('location');
    return {
      department: departments.sort(),
      title: titles.sort(),
      location: locations.sort(),
    };
  }
}
