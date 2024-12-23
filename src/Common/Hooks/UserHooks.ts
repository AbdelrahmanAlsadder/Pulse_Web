import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";


// React Hook is a special function in React
//  that lets developers use state and other
//   React features without writing a class. 
//   It makes code simpler and easier to manage
//    by allowing functionality to be added 
//    directly within components. React Hooks 
//    makes the code easier to read and write.



//this hook is used to determine if a user is 
// logged in (userProfile and token are available)
//  or if the app is still determining the user's session (loading is true).



/**
 * Custom React Hook to manage the logged-in user's profile data and state.
 * - `useProfile` initializes and manages the user's profile, loading state, and token.
 * - Retrieves the user's session data from `getLoggedinUser` and provides it to components.
 */
const useProfile = () => {
  // Get the user session data from the helper function
  const userProfileSession = getLoggedinUser();

  // Extract the token from the session data, if available
  var token =
    userProfileSession &&
    userProfileSession["token"];

  // State to track whether the profile is still loading
  const [loading, setLoading] = useState(userProfileSession ? false : true);

  // State to store the user's profile information
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  // Effect that runs once on component mount to initialize profile and token
  useEffect(() => {
    // Retrieve the user session data again (in case it was updated)
    const userProfileSession = getLoggedinUser();

    // Extract the token from the session data
    var token =
      userProfileSession &&
      userProfileSession["token"];

    // Update the profile state with the session data
    setUserProfile(userProfileSession ? userProfileSession : null);

    // Set the loading state based on whether a token exists
    setLoading(token ? false : true);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Return the user's profile, loading state, and token to the component using this hook
  return { userProfile, loading, token };
};

export { useProfile };
