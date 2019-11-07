import { GraphQLScalarType, Kind, validate } from 'graphql';
import { ValidationError } from 'apollo-server';

export const SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG = 'This value cannot be empty!';
export const SCALAR_NON_BLANK_STRING_AST_ERROR_MSG = 'This field should be a string';

let parse = (val) => {
  if (val.length < 1) {
    throw new ValidationError(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);
  }
  return val;
};

export const NonBlankString = new GraphQLScalarType({
  name: 'NonBlankString',
  description: 'String that cannot be empty. Error will be thrown',
  parseValue: parse,
  serialize: (val) => {
    // To client
    return val;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return parse(ast.value);
    }
    throw new ValidationError(SCALAR_NON_BLANK_STRING_AST_ERROR_MSG);
  }
})