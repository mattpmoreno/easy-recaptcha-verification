import {HTTPSRequestResponse, RecaptchaResponseFromGoogle, RecaptchaResponseInternal} from "./interfaces";
import {makeError, RecaptchaErrors} from "./recaptcha-errors";
import {packageName} from "./global.constants";

/****************************************************************************************
 * Utility functions for processing responses to recaptcha token submission
 * Docs found at: https://developers.google.com/recaptcha/docs/verify
 ****************************************************************************************/
export class RecaptchaResponseUtils {
  /****************************************************************************************
   * Internal methods
   ****************************************************************************************/
  /**
   * @method
   * @description
   * Creates the request options for an https request to google's recaptcha server
   * @param recaptchaToken {string} recaptcha token submitted by user
   * @param secretToken {string} our secret token
   * @return {RequestOptions} https request options
   **/
  public static createGoogleRecaptchaURL(recaptchaToken: string, secretToken: string): string {
    return `https://www.google.com/recaptcha/api/siteverify?secret=${secretToken}&response=${recaptchaToken}`;
  }
  /**
   * @method
   * @description
   * Figures out which errors Google gave us and how we should handle them
   * @param response {HTTPSRequestResponse<RecaptchaResponseFromGoogle>} response from google
   * @param errors {RecaptchaErrors} the error details we want to use to create response
   * @return {RecaptchaResponseInternal} the internal type response the server is waiting for
   **/
  public static figureOutWhichErrorWeHave(
    response: HTTPSRequestResponse<RecaptchaResponseFromGoogle>,
    errors: RecaptchaErrors
  ): RecaptchaResponseInternal{
    if (response.body["error-codes"].includes('invalid-input-response')) {
      return RecaptchaResponseUtils.invalidUserToken(response, errors);
    }
    if (response.body["error-codes"].includes('timeout-or-duplicate')) {
      return RecaptchaResponseUtils.submissionTimeout(errors);
    }
    return RecaptchaResponseUtils.issuesWithUtilsOrServer(response, errors);
  }
  /**
   * @method
   * @description
   * Called when we are having some issues with this package or server settings
   **/
  private static issuesWithUtilsOrServer(
    response: HTTPSRequestResponse<RecaptchaResponseFromGoogle>,
    errors: RecaptchaErrors
  ): RecaptchaResponseInternal {
    // we post to console to let server administrator know something is up
    console.log(
      packageName + ': error in package or with your settings for Google Recaptcha. See details below:'
    );
    console.log(response.body["error-codes"]);
    return makeError(errors.serverIssues);
  }
  /**
   * @method
   * @description
   * Called when the user token is invalid (could represent bots)
   **/
  private static invalidUserToken(
    response: HTTPSRequestResponse<RecaptchaResponseFromGoogle>,
    errors: RecaptchaErrors
  ): RecaptchaResponseInternal {
    // we post to console to let server administrator know something is up
    console.log(packageName + ': Invalid user token was submitted. See details below:');
    console.log(response);
    return makeError(errors.invalidUserToken);
  }
  /**
   * @method
   * @description
   * Called when user didnt submit quickly enough
   **/
  private static submissionTimeout(errors: RecaptchaErrors): RecaptchaResponseInternal {
    // we post to console and tell user that robots are not allowed
    return makeError(errors.submissionTimeout);
  }
}