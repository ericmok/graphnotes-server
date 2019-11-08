import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { UserInputError, AuthenticationError } from 'apollo-server';
import { User } from '../entity/User';

const NUMBER_ROUNDS = 12;
let APP_SECRET = process.env.APP_SECRET || Math.random().toString();

if (!process.env.APP_SECRET) {
  console.warn("No APP_SECRET env variable supplied! Remember to provide one in production.");
}

export class UserAlreadyExistsError extends UserInputError {
  constructor() {
    super("A user has already used this username. Please choose another username.");
  }
}

export class UserCreationDatabaseError extends Error {
  constructor(err) {
    super(err);
    this.name = "UserCreationDatabaseError";
  }
}

const Auth = {
  async signup(username: string, password: string) {
    const existingUsers = await getManager().find(User, {
      username
    });

    if (existingUsers.length > 0) {
      throw new UserAlreadyExistsError();
    }

    try {
      const newUser = new User({
        username, 
        password: await bcrypt.hash(password, NUMBER_ROUNDS)
      });
      const saveResult = await getManager().save(newUser);
      return saveResult;
    }
    catch (err) {
      throw new UserCreationDatabaseError(err);
    }
  },
  async login(username: string, password: string) {
    const user = await getManager().findOne(User, { username });
    if (!user) {
      throw new AuthenticationError("Invalid user");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError("Invalid password");
    }

    return {
      token: jwt.sign({ 
        username,
        startDate: new Date()
      }, APP_SECRET)
    }
  },
  async isLoggedIn() {
    return false;
  }
};

export default Auth;

/*
References
https://stackoverflow.com/questions/51860043/javascript-es6-typeerror-class-constructor-client-cannot-be-invoked-without-ne
*/