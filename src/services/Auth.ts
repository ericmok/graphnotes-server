import { getManager } from 'typeorm';
import { User } from '../entity/User';

class UserAlreadyExistsError extends Error {
  constructor() {
    super("A user has already used this username. Please choose another username.");
    this.name = "UserAlreadyExistsError";
  }
}

class UserCreationDatabaseError extends Error {
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
      const newUser = new User({username, password});
      const saveResult = await getManager().save(newUser);
      return saveResult;
    }
    catch (err) {
      throw new UserCreationDatabaseError(err);
    }
  }
};

export default Auth;