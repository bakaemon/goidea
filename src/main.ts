import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'express-handlebars';
import * as bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_MAX, PORT } from './configs/env';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.engine('hbs', hbs.engine({
    extname: 'hbs',
    partialsDir: join(__dirname, '..', 'views/partials'),
    layoutsDir: join(__dirname, '..', 'views/layouts'),
    defaultLayout: 'main.hbs'
  }));
  app.set('view engine', 'hbs');

  // NOTE: body parser
  app.use(bodyParser.json({ limit: "50mb" }));

  // cookie parser
  app.use(cookieParser());

  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000
    })
  );

  // NOTE: rateLimit
  app.use(
    rateLimit({
      windowMs: 1000 * 60 * 60, // an hour
      max: RATE_LIMIT_MAX || 10000, // limit each IP to 100 requests per windowMs
      message:
        "⚠️  Too many request created from this IP, please try again after an hour"
    })
  );

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });

  await app.listen(PORT || 3000);
}


bootstrap();
