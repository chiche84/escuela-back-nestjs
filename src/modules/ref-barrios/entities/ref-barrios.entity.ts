import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('RefBarrios')
export class RefBarrios1 {
    @ObjectIdColumn()
    _id: number;

    @Column()
    nombreBarrio: string;

    @Column({ default: true })
    estaActivo: boolean;
}