import { getManager } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { User } from '../entity/User';

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
      const newUser = new User({ username, password });
      const saveResult = await getManager().save(newUser);
      return saveResult;
    }
    catch (err) {
      throw new UserCreationDatabaseError(err);
    }
  }
};

export default Auth;

/*
References
https://stackoverflow.com/questions/51860043/javascript-es6-typeerror-class-constructor-client-cannot-be-invoked-without-ne
*/