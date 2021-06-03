import {RecaptchaResponseUtils} from "./recaptcha-response-utils";
import {defaultRecaptchaErrors, RecaptchaErrors, makeError, makeRecaptchaSuccess} from "./recaptcha-errors";
import {RecaptchaResponseInternal, HTTPSRequestResponse, RecaptchaResponseFromGoogle} from "./interfaces";
import {httpsRequestWrapper} from "./https-request";

/**
 * @function
 * @description
 * Checks the recaptcha token we got from a user and makes sure it is valid
 * @param recaptchaToken {string} recaptcha token from user
 * @param recaptchaSecret {string} secret backend validation token from Google
 * @param recaptchaErrors {RecaptchaErrors} errors and status codes we send to users
 * @return {Promise<RecaptchaResponseInternal>} promise telling us whether this recaptcha response is valid or not
 **/
export function checkRecaptchaToken(
  recaptchaToken: string, recaptchaSecret: string,
  recaptchaErrors: RecaptchaErrors = defaultRecaptchaErrors
): Promise<RecaptchaResponseInternal> {
  // first we need to check that the token itself isnt garbage (falsy or blank string)
  if (!recaptchaToken? true : recaptchaToken.length === 0) {
    return Promise.resolve(makeError(recaptchaErrors.noUserToken));
  }
  // Create the correct options to be used in our https request
  const recaptchaURL = RecaptchaResponseUtils.createGoogleRecaptchaURL(recaptchaToken, recaptchaSecret);
  // Send the request and get the data back from google's servers
  return httpsRequestWrapper(recaptchaURL).then(
    (response: HTTPSRequestResponse<RecaptchaResponseFromGoogle>) => {
      // if it was successful, then we return success
      if (response.body.success) {
        return makeRecaptchaSuccess();
      }
      return RecaptchaResponseUtils.figureOutWhichErrorWeHave(response, recaptchaErrors);
    }
  );
}
