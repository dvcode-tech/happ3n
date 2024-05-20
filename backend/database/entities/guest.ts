import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user';
import { Event } from './event';

export enum GuestStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum GoingStatus {
  MAYBE = 0,
  GOING = 1,
  NOT_GOING = 2,
}

export enum EntryStatus {
  PENDING = 0,
  CHECKEDIN = 1,
}

@Entity({
  name: 'guests',
})
export class Guest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Event, (event) => event.guests)
  event: Event;

  @Column({ type: 'text', nullable: true })
  answers: string;

  @Column({ type: 'int', default: GuestStatus.PENDING })
  status: GuestStatus;

  @Column({ type: 'int', default: GoingStatus.GOING })
  going_status: GoingStatus;

  @Column({ type: 'int', default: EntryStatus.PENDING })
  entry_status: EntryStatus;

  @Column({ type: 'bigint', nullable: true })
  entry_at: number;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;
}
