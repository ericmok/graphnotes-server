import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
import { GQLUser } from '../generated/graphql';

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    token: string;

    @Column()
    tokenIssuedAt: Date

    toGQL(): GQLUser {
        return {
            username: this.username
        }
    }

    constructor(data?: { username: string, password: string }) {
        if (data) {
            this.username = data.username;
            this.password = data.password;
        }
    }
}
