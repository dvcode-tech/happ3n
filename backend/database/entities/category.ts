import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "categories",
})
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "int", default: 0 })
  status: number;

  @Column({ type: "bigint" })
  created_at: number;

  @Column({ type: "bigint" })
  updated_at: number;
}
