import { Application } from './api/app.service';
import { DataSource } from 'typeorm';
import { Admin } from 'src/core/entity/admin.entity';
import * as bcrypt from 'bcryptjs';
import { AdminRoles } from 'src/core/entity/admin.entity';
import { config } from './config';

(async () => {
  // DataSource obyektini sozlash
  const dataSource = new DataSource({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    entities: [Admin],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established.');

    const adminRepository = dataSource.getRepository(Admin);

    const superAdminUsername = 'superAdmin';
    const adminUsername = 'admin';
    const password = 'parol1234';

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdminExists = await adminRepository.findOneBy({
      username: superAdminUsername,
    });
    if (!superAdminExists) {
      const superAdmin = adminRepository.create({
        username: superAdminUsername,
        hashed_password: hashedPassword,
        phone_number: '+998911234567',
        role: AdminRoles.SUPERADMIN,
      });
      await adminRepository.save(superAdmin);
      console.log('SuperAdmin created.');
    } else {
      console.log('SuperAdmin already exists.');
    }

    const adminExists = await adminRepository.findOneBy({
      username: adminUsername,
    });
    if (!adminExists) {
      const admin = adminRepository.create({
        username: adminUsername,
        hashed_password: hashedPassword,
        phone_number: '+998901234567',
        role: AdminRoles.ADMIN,
      });
      await adminRepository.save(admin);
      console.log('Admin created.');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
})();

void Application.main();
