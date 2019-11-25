import { Entity, PrimaryGeneratedColumn, ObjectID, Column } from "typeorm";
import { GQLUser } from '../generated/graphql';
import { TYPE_USER } from '../resolvers/Types';
import { encodeId } from '../utils';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    // These fields are if you want to use stateful tokens
    // @Column()
    // token: string;
    
    // @Column()
    // tokenIssuedAt: Date

    encodedId() {
        return encodeId(this.id.toString(), TYPE_USER);
    }

    toGQL(): GQLUser {
        return {
            id: this.encodedId(),
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
