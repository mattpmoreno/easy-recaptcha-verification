
/****************************************************************************************
 * Interfaces for this module
 ****************************************************************************************/
export interface RecaptchaResponseInternal {
  goodToGo: boolean,
  error: Error | undefined
}
export interface RecaptchaResponseFromGoogle {
  "success": boolean,
  "challenge_ts": Date,
  "hostname": string,
  "error-codes": string[]
}
export interface HTTPSRequestResponse<T> {
  statusCode: number | undefined,
  headers: unknown,
  body: T
}
