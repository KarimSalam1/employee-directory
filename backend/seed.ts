import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { EmployeeService } from './src/employee/employee.service';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeeService = app.get(EmployeeService);

  const response = await axios.get('https://randomuser.me/api/?results=20');
  const users = response.data.results;

  const employees = users.map((user: any) => ({
    firstName: user.name.first,
    lastName: user.name.last,
    email: user.email,
    department: ['Engineering', 'HR', 'Sales', 'Marketing'][
      Math.floor(Math.random() * 4)
    ],
    title: ['Manager', 'Developer', 'Designer', 'Analyst'][
      Math.floor(Math.random() * 4)
    ],
    location: `${user.location.country}`,
    avatar: user.picture.large,
  }));

  for (const emp of employees) {
    await employeeService.create(emp);
  }

  console.log('Database seeded with random users.');
  await app.close();
}

bootstrap();
