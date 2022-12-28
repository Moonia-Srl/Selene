import {
  buildMessage,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Custom validation for class-validator library to validate at runtime
 * addresses for multiple blockchains (at the moment only Ethereum and
 * Solana are supported).
 * @param {ValidationOptions} opt - Additional options
 * @returns {() => void} - A callback to register the decorator
 */
export const IsMultichainAddress = (opt?: ValidationOptions) => {
  const validator: ValidatorConstraintInterface = {
    // Specify a function that will execute and check upon the validation.
    validate: (value: string) => {
      // ETHEREUM wallet desired format
      const ETH_WALLET_REGEX = /(ETHEREUM):(0x)(\w{40})/gm;
      // SOLANA wallet desired format
      const SOL_WALLET_REGEX = /(SOLANA)(:)(\w{44})/gm;

      // Array of possible match candidates, only one correct mach is needed
      const RegexArray = [ETH_WALLET_REGEX, SOL_WALLET_REGEX];
      const res = RegexArray.some(r => r.test(value));
      return res;
    },

    // Specify a message builder to create custom error messages.
    defaultMessage: buildMessage(() => `$property must be a multichain address`, opt),
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) =>
    registerDecorator({
      name: 'isMultichainAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: opt,
      validator,
    });
};
