import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { postgresAdapter } from '@payloadcms/db-postgres';

export const getDatabaseAdapter = () => {
  const dbType = process.env.DATABASE_TYPE || 'mongodb';

  if (dbType === 'postgres') {
    return postgresAdapter({
      pool: {
        connectionString:
          process.env.DATABASE_URI || 'postgresql://admin:password@localhost:5432/postgres',
      },
    });
  }

  // Default to MongoDB
  return mongooseAdapter({
    url:
      process.env.DATABASE_URI ||
      'mongodb://admin:password@localhost:27017/mongodb?authSource=admin',
  });
};
