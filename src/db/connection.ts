
export default async () => {
  return require('knex')({
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_GRPC_EXECUTOR_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_GRPC_EXECUTOR_DB_SCHEMA || 'public'],
    pool: {
      min: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_POOL_MIN ?
        Number(process.env.R7PLATFORM_GRPC_EXECUTOR_DB_POOL_MIN) : 0,
      max: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_POOL_MAX ?
        Number(process.env.R7PLATFORM_GRPC_EXECUTOR_DB_POOL_MAX) : 100,
    },
    debug: process.env.R7PLATFORM_GRPC_EXECUTOR_DB_DEBUG === "Y" ? true : false,
  })
}
