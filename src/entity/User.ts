import {Entity, ObjectIdColumn, ObjectID, Column, Timestamp} from "typeorm";

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    token: string;

    @Column()
    tokenIssuedAt: Date

}
