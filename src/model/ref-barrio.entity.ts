import { Entity, Column,  CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RefBarrios')
export class RefBarriosEntity {
    
    @PrimaryGeneratedColumn('uuid')
    idBarrio: string;

    @Column({ type: 'varchar', length: 300, nullable:false })
    nombreBarrio: string ;

    @Column({ type: 'boolean', default: true })
    estaActivo: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @Column({ type: 'varchar', length: 300})
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @Column({ type: 'varchar', length: 300 })
    lastChangedBy: string;

    @DeleteDateColumn({ type: 'timestamptz' })
    deleteDateTime: Date;

}