import {RecaptchaResponseInternal} from "./interfaces";

/****************************************************************************************
 * Default error messages / codes
 ****************************************************************************************/
// Adding status code to error object so we can throw in express
export class StatusCodeError implements Error {
  // Pulled in these to implement Error correctly, though we dont use them
  public name: string = '';
  public stack?: string = '';
  // Adding status code to error object
  constructor(public message: string, public statusCode: number) {}
}
// List of specific errors for this module
export interface RecaptchaErrors {
  noUserToken: StatusCodeError,
  serverIssues: StatusCodeError,
  invalidUserToken: StatusCodeError,
  submissionTimeout: StatusCodeError
}
// Default error messages and codes, can be overridden
export const defaultRecaptchaErrors: RecaptchaErrors = {
  noUserToken: new StatusCodeError(
    'Recaptcha token has not been instantiated',
    400
  ),
  serverIssues: new StatusCodeError(
    'Sorry, we are experiencing some server issues. Please try again later',
    500
  ),
  invalidUserToken: new StatusCodeError(
    'Recaptcha token submitted is invalid. Please try again.',
    401
  ),
  submissionTimeout: new StatusCodeError(
    'Please submit your sign up form faster, thank you',
    408
  ),
}
/****************************************************************************************
* Utility Functions
****************************************************************************************/
/**
 * @function
 * @description
 * Creates the Recaptcha response in the case of an error
 * @param error {StatusCodeError} error message and status code containing object
 * @return {RecaptchaResponseInternal} tells us that we are not good to go and contains the error to throw
**/
export function makeError(error: StatusCodeError): RecaptchaResponseInternal {
  return {goodToGo: false, error: error};
}
/**
 * @function
 * @description
 * Makes a successful recaptcha response for our server
 **/
export function makeRecaptchaSuccess(): RecaptchaResponseInternal {
  return {goodToGo: true, error: undefined};
}
