import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Model, Connection, createConnection } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Ipago } from './interfaces/pago.interface';
import { OpService } from '../op/op.service';
import { UpdateOpDto } from '../op/dto/update-op.dto';
import { unlink, writeFile, readFile  } from 'fs/promises';
import * as nodemailer from 'nodemailer';
import path = require('path');
import html_to_pdf = require('html-pdf-node');

@Injectable()
export class PagosService {

  constructor( @InjectModel('Pagos') private readonly pagosModel: Model<Ipago>,
                @InjectConnection('ConexionEscuelaDeDanza') private conexionDanza: Connection,
                private readonly opService: OpService){}

  async create(createPagoDto: CreatePagoDto) { 
    let pago: Ipago;
    const conexionSesion = await this.conexionDanza.startSession();
   
    try {
      conexionSesion.startTransaction();
      
      await this.conexionDanza.transaction(async (sesion) => {
        pago =  await this.pagosModel.create({ 
          idOpPagada: createPagoDto.idOpPagada, 
          monto: createPagoDto.monto, 
          fechaPago: createPagoDto.fechaPago, 
          idUsuario: createPagoDto.idUsuario,
          session: sesion
          });
          if (! pago) {
            throw new UnprocessableEntityException();
          }
          //POST CONDICION: restar saldo de la OP    
          const opModificada = await this.opService.opById(pago.idOpPagada);
          const saldoRestante = opModificada.monto - pago.monto;  
          const objModif: UpdateOpDto = { saldo: saldoRestante };
          const actualizarOP = await this.opService.modificarOP(pago.idOpPagada, objModif, sesion); 
      }).then(resp=> {            
            return pago;
      }).catch(err=> {
        console.log("Error", err);        
        return null;
      })
            
    } catch (error) {
      console.log("fue pal error");
      pago = null;
    } 
    conexionSesion.endSession();    
    return pago;
  }

 


  async crearmuchos( createPagoDto: CreatePagoDto[]){
    let pagos: Ipago[];
    try {      
      pagos = await this.pagosModel.create(createPagoDto);

      for (let index = 0; index < pagos.length; index++) {
        const pago = pagos[index];
        let opModificada = await this.opService.opById(pago.idOpPagada);
        let saldoRestante = opModificada.monto - pago.monto;  
        let objModif: UpdateOpDto = { saldo: saldoRestante };
        let actualizarOP = await this.opService.modificarOP(pago.idOpPagada, objModif);
      }
    } catch (error) {
      
    }
    return pagos;
  }
  
  async crearRecibo(recibo: string, nombre:string){
    let options = {width:'646px', heigth:'359px', path: '',  args: ['--no-sandbox', '--disable-setuid-sandbox'] }; 
   
    let html = '';
    await readFile(recibo, 'utf8')
      .then(arch => {
                  html = arch;                  
                  //return writeFile('./htmlicito.html',html);
                  writeFile('./htmlicito.html',html);
      })
      .then(resp=> { console.log("Ruta: ", resp)})
      .catch(console.log)

    let absolutePath = path.resolve("./htmlicito.html");    
    let file = { url: absolutePath}

    //convierte bien si viene el objeto url completo con el html completo (con encabezado y todo)
    await html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      console.log("PDF Buffer: ", pdfBuffer); 
      writeFile(`./${nombre}.pdf`, pdfBuffer).then(resp=> {
        console.log('PDF creado', resp);
        return 'PDF creado';
      })
        .catch( (err)=> {
              if (err) {
                console.log("ERROR AL ESCRIBIR 1",err);
                return null;
              }
            });

    }).catch(error => {
          console.log(error);
          return null;
    });

  }

  async enviarEmailRecibo(email: string, nombrearchivo: string){
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'elantigal@gmail.com',
        pass: 'dtqugmeaeubkuhfh'
      }
    });
    
    let mailOptions = {
      from: 'elantigal@gmail.com',
      to: email,
      subject: `Recibo Email`,
      html:`Se adjunta el recibo de pago`,
      attachments: [           
        {   
          path: `./${nombrearchivo}.pdf`
        },
      ]
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return null;
      } else {
        console.log('Email enviado: ' + info.response);
        //aca debo eliminar el recibo que ya se envio
        //unlink(`./${nombrearchivo}.pdf`);
        return 'Email enviado';
      }
    });
  }

  async descargarRecibo(){

  }

  findAll() {
    return `This action returns all pagos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pago`;
  }

  update(id: number, updatePagoDto: UpdatePagoDto) {
    return `This action updates a #${id} pago`;
  }

  remove(id: number) {
    return `This action removes a #${id} pago`;
  }
}
