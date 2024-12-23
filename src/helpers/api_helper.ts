
//Axios is a popular JavaScript library used for making HTTP requests from a web browser
//the youtube video added this file with the tokens after conntecting the firebase
//to create an http request so it's authenticated or something

import axios from "axios";

// Set default base URL for Axios requests
axios.defaults.baseURL = "";

// Set the default content type for POST requests to "application/json"
axios.defaults.headers.post["Content-Type"] = "application/json";

// Retrieve the authentication token from sessionStorage (if available)
const authUser: any = sessionStorage.getItem("authUser")
const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;

// If token exists, set the Authorization header with the Bearer token
if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// Axios response interceptor to handle API responses and errors
axios.interceptors.response.use(
  function (response:any) {
    // If data exists, return response.data, otherwise return the response
    return response.data ? response.data : response;
  },
  function (error:any) {
    // Handle errors based on status code
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    // Reject the promise with the error message
    return Promise.reject(message);
  }
);

/**
 * Sets the default Authorization header with the provided token
 * @param {*} token - The token to be set for Authorization header
 */
const setAuthorization = (token: any) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from the given URL with optional query parameters
   * @param {string} url - The URL to make the GET request
   * @param {object} params - Optional parameters to be sent with the request
   * @returns {Promise} - Returns the API response
   */
  get = (url: any, params: any) => {
    let response;
    let paramKeys: any = [];

    // If parameters exist, convert them into a query string
    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      // Build the query string from the params
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params); // Make GET request with query string
    } else {
      // If no params, simply make a GET request
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  /**
   * Sends a POST request to the given URL with the provided data
   * @param {string} url - The URL to make the POST request
   * @param {object} data - The data to be sent with the POST request
   * @returns {Promise} - Returns the API response
   */
  create = (url: any, data: any) => {
    return axios.post(url, data);
  };

  /**
   * Sends a PATCH request to the given URL to update the data
   * @param {string} url - The URL to make the PATCH request
   * @param {object} data - The data to be sent with the PATCH request
   * @returns {Promise} - Returns the API response
   */
  update = (url: any, data: any) => {
    return axios.patch(url, data);
  };

  /**
   * Sends a PUT request to the given URL to replace the data
   * @param {string} url - The URL to make the PUT request
   * @param {object} data - The data to be sent with the PUT request
   * @returns {Promise} - Returns the API response
   */
  put = (url: any, data: any) => {
    return axios.put(url, data);
  };

  /**
   * Sends a DELETE request to the given URL
   * @param {string} url - The URL to make the DELETE request
   * @param {object} config - Optional configuration for the DELETE request
   * @returns {Promise} - Returns the API response
   */
  delete = (url: any, config: any) => {
    return axios.delete(url, { ...config });
  };
}

/**
 * Retrieves the logged-in user's details from sessionStorage
 * @returns {object | null} - Returns the user object if logged in, otherwise null
 */
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null; // Return null if no user is found in sessionStorage
  } else {
    return JSON.parse(user); // Parse and return the user object
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
