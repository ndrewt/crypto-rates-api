import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.INIT_SERVICE_CORS == '1') {
    app.enableCors();
    console.log('Cors is enabled');
  }

  const Swaggerconfig = new DocumentBuilder()
    .setTitle('Crypto Rates API')
    .setDescription(
      `Service for fetching ccrypto rates by binance API & Uniswap
      Uses MongoDB and Redis databases`,
    )
    .setVersion(require('../package.json').version)
    .addBearerAuth()
    .addServer(`http://localhost:${process.env.INIT_SERVICE_PORT || 3000}`)
    .build();

  const document = SwaggerModule.createDocument(app, Swaggerconfig);
  SwaggerModule.setup('/swagger', app, document);
  console.log('Swagger has been started');

  await app.listen(process.env.INIT_SERVICE_PORT || 3000);
  console.log(
    'Server started on port ' + (process.env.INIT_SERVICE_PORT || 3000),
  );
}
bootstrap();
