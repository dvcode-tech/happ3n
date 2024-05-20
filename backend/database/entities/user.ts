import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', unique: true })
  principal_id: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  facebook: string;

  @Column({ type: 'text', nullable: true })
  twitter: string;

  @Column({ type: 'text', nullable: true })
  tiktok: string;

  @Column({ type: 'text', nullable: true })
  instagram: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  profile_photo: string;

  @Column({ type: 'text', nullable: true })
  banner_photo: string;

  @Column({ type: 'int', default: 0 })
  status: number;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;
}
