import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "posts",
})
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "bigint" })
  userId: number;

  @Column({ type: "bigint" })
  categoryId: number;

  @Column({ type: "int", default: 0 })
  status: number;

  @Column({ type: "bigint" })
  created_at: number;

  @Column({ type: "bigint" })
  updated_at: number;
}
