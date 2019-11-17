import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { UserInputError, AuthenticationError } from 'apollo-server';
import { User } from '../entity/User';

const NUMBER_ROUNDS = 12;
const DEFAULT_SECRET = "h4-98po"
let APP_SECRET = process.env.APP_SECRET || DEFAULT_SECRET;
const TOKEN_EXPIRY_TIME = '4s';

if (!process.env.APP_SECRET) {
  console.warn("No APP_SECRET env variable supplied! Remember to provide one in production.");
}

export class UnknownAuthError extends AuthenticationError {
  constructor(err: string) {
    super(err);
  }
}

export class AuthTokenError extends AuthenticationError {
  constructor(err: JsonWebTokenError) {
    super(err.message);
  }
}

export class AuthTokenExpiredError extends AuthenticationError {
  constructor(err: TokenExpiredError) {
    super(`Token expired at ${err.expiredAt}`);
  }
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

export interface TokenPayload {
  username: string
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
      }, APP_SECRET, {
        expiresIn: TOKEN_EXPIRY_TIME
      })
    }
  },
  // A soft test on token. To deprecate... 
  async xisLoggedIn(tokenString: string) {
    try {
      if (jwt.verify(tokenString, APP_SECRET)) {
        return true;
      }
    }
    catch (err) {
      if (err instanceof JsonWebTokenError) {
        return false;
      }
      if (err instanceof TokenExpiredError) {
        return false;
      }
      throw err;
    }
    return false;
  },
  async validateToken(token: string) {
    try {
      if (jwt.verify(token, APP_SECRET)) {
        const tokenPayload: TokenPayload = jwt.decode(token) as TokenPayload;
        const user = await getManager().findOne(User, { username: tokenPayload.username });
        return user.toGQL();
      }
    }
    catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AuthTokenError(err);
      }
      if (err instanceof TokenExpiredError) {
        throw new AuthTokenExpiredError(err);
      }
      if (err instanceof NotBeforeError) {
        throw new AuthenticationError(`Token not activated yet...`);
      }
      throw err;
    }

    // Unreachable code? Defensively throw error.
    throw new UnknownAuthError("Something is wrong with the token...");
  }
};

export default Auth;

/*
References
https://stackoverflow.com/questions/51860043/javascript-es6-typeerror-class-constructor-client-cannot-be-invoked-without-ne
https://github.com/auth0/node-jsonwebtoken
*/