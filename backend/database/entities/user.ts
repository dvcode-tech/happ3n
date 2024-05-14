import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text", unique: true })
  principal_id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", default: "user" })
  role: string;

  @Column({ type: "int", default: 0 })
  status: number;

  @Column({ type: "bigint" })
  created_at: number;

  @Column({ type: "bigint" })
  updated_at: number;
}
