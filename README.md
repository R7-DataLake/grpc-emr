# gRPC Server for EMR service (สำหรับ สสจ.)

running: 
```
NODE_ENV=development
R7PLATFORM_GRPC_EMR_DB_HOST=127.0.0.1 \
R7PLATFORM_GRPC_EMR_DB_PORT=5433 \
R7PLATFORM_GRPC_EMR_DB_NAME=r7platform \
R7PLATFORM_GRPC_EMR_DB_SCHEMA=rawdata \
R7PLATFORM_GRPC_EMR_DB_USER=postgres \
R7PLATFORM_GRPC_EMR_DB_PASSWORD=xxxxxx \
R7PLATFORM_GRPC_EMR_DB_POOL_MIN=2 \
R7PLATFORM_GRPC_EMR_DB_POOL_MAX=10 \
R7PLATFORM_GRPC_EMR_SECRET_KEY=xxxxxx \
R7PLATFORM_GRPC_EMR_DB_DEBUG=Y \
npm start
```