import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { v2 } from 'cloudinary';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { Client, MessageMedia } from 'whatsapp-web.js';
const qrcode = require('qrcode-terminal');

const SESSION_FILE_PATH = './session.json';

let sessionData;
let cliente = new Client({});

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
  
  await app.listen(process.env.PORT || 8000);
  
  console.log("Cloudinary OK"); 
  console.log('Servidor corriendo en puerto', process.env.PORT || 8000);

  
  if (fs.existsSync(SESSION_FILE_PATH)) {

    sessionData = require('.'+SESSION_FILE_PATH);    
    
    cliente = new Client({
        session: sessionData
    })

    cliente.on('ready', () => {
        console.log("Cliente listo");
        //spinner.stop();
        escucharMsj();
        //cliente.sendMessage('5493884719054@c.us', 'bot dice: que yo te amo');
        //enviarDoc('5493884895231@c.us', "Angular async pipe y observables.pdf");
    });

    cliente.on('auth_failure', () => {
        //spinner.stop();
        console.log("Error de autentificacion, vuelve a generar el QRCODE (borrar el anterior)");
    });

    cliente.initialize();
  }else{
    console.log("No tenemos una sesion iniciada");
    cliente = new Client({});
    cliente.on('qr', qr => {
        qrcode.generate(qr, { small: true });
        console.log('QR RECEIVED', qr);
    });

    cliente.on('authenticated', (session) => {
        //guardamos las credenciales de session para usar luego
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    cliente.initialize();
  } 

}

const escucharMsj = () => {
  cliente.on('message', (msj) => {
      const { from, to, body } = msj;
      console.log(from, to, body);
      switch (body) {
          case 'archivo':
              //cliente.enviarDoc(from, "C# - Delegados y Eventos.pdf");                
              console.log("archivo enviado");
              break;
      }
      // if (from === '5493885282203@c.us') {
      //     cliente.sendMessage('5493885282203@c.us', "Bot dice: recibido bb :)");
      //     console.log("enviado a flor");
      // }
  })
}


const enviarDoc = (destino, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`);
  cliente.sendMessage(destino, mediaFile);
}

bootstrap();
