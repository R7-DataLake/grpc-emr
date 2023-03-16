
export default async () => {
  return require('knex')({
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_GRPC_EMR_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_GRPC_EMR_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_GRPC_EMR_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_GRPC_EMR_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_GRPC_EMR_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_GRPC_EMR_DB_SCHEMA || 'public'],
    debug: process.env.R7PLATFORM_GRPC_EMR_DB_DEBUG === "Y" ? true : false,
  })
}
