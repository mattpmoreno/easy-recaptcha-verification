import {HTTPSRequestResponse} from "./interfaces";
import {RequestOptions} from "https";
import {IncomingMessage} from "http";

const https = require("https");

/**
 * @function
 * @description
 * Making a quick wrapper for https requests in order to simplify code
 * @param url {string} url as a string
 * @param body? {any} body of the https request we are sending
 * @return {Promise<HTTPSRequestResponse>} promise containing the data we are looking for
 **/
export function httpsRequestWrapper(
  url: string, body = null
): Promise<HTTPSRequestResponse<any>> {
  // Then create the URL object we are using
  let urlObject: URL;
  try {urlObject = new URL(url);} catch (error) {throw new Error(`Invalid url ${url}`);}
  // Create request options
  let options: RequestOptions = {
    method: 'POST',
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.search? urlObject.pathname + urlObject.search : urlObject.pathname
  };
  // then return the promise object
  return new Promise((resolve, reject) => {
    // Creating the client request object
    const clientRequest = https.request(options, (incomingMessage: IncomingMessage) => {
      let tempBody: any[] = [];
      // Response object
      let response: HTTPSRequestResponse<unknown> = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: {}
      };
      // Collect response body data.
      incomingMessage.on('data', chunk => {
        tempBody.push(chunk);
      });
      // Resolve on end.
      incomingMessage.on('end', () => {
        if (tempBody.length) {
          let tempBodyString: string = tempBody.join();
          try {
            response.body = JSON.parse(tempBodyString);
          } catch (error) {
            // Silently fail if response is not JSON.
          }
        }
        resolve(response);
      });
    });
    // Reject on request error.
    clientRequest.on('error', (error: Error) => {
      reject(error);
    });
    // Write request body if present.
    if (body) {
      clientRequest.write(body);
    }
    // Close HTTP connection.
    clientRequest.end();
  });
}