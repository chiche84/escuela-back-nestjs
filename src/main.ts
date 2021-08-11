import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as schedule from 'node-schedule';
import { NestExpressApplication } from '@nestjs/platform-express';
import { v2 } from 'cloudinary';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');  


  const cloudinary = v2;
  if (process.env.CLOUDINARY_NAME === undefined || process.env.CLOUDINARY_APIKEY === undefined || process.env.CLOUDINARY_APISECRET === undefined) {
      console.warn("No estan seteados los valores para Cloudinary en el env");
      return;
  }
  cloudinary.config({
      cloud_name:  process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret:  process.env.CLOUDINARY_APISECRET,
      secure: true
  });

  console.log("Cloudinary OK");



  
  await app.listen(process.env.PORT || 8000);
  console.log('Servidor corriendo en puerto', process.env.PORT || 8000)
  
  //TODO: Para realizar tareas recurrentes:
  // const rule = new schedule.RecurrenceRule();
  // rule.second = 15;
  // let i = 0;
  // schedule.scheduleJob(rule, () => {
  //   i++;
  //   console.log('segundo 15... activate locoooo, vamos ' + i + ' minutos');
  // });
}
bootstrap();
