import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Event } from './event';
import { User } from './user';

export enum NotificationStatus {
  UNREAD = 0,
  READ = 1,
}

@Entity({
  name: 'notifications',
})
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Event)
  event: Event;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'int', default: 0 })
  type: number;

  @Column({ type: 'int', default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;
}
