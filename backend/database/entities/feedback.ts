import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Event } from './event';
import { Guest } from './guest';

@Entity({
  name: 'feedbacks',
})
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Guest)
  @JoinColumn()
  guest: Guest;

  @ManyToOne(() => Event, (event) => event.feedbacks)
  event: Event;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'int', default: 5 })
  rate: number;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;
}
