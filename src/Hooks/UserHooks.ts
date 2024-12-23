//The useProfile custom hook is designed to manage
//  the logged-in user's profile state, 
// including loading and token information. 
// It does so by leveraging sessionStorage to retrieve the user's profile and token.

import { useEffect, useState } from "react";
import { getLoggedinUser } from "../helpers/api_helper";

/**
 * Custom hook to manage and retrieve the logged-in user's profile
 */
const useProfile = () => {
  // Get user profile from sessionStorage using the getLoggedinUser helper function
  const userProfileSession = getLoggedinUser();
  
  // Extract token from the session profile if available
  var token = userProfileSession && userProfileSession["token"];

  // State to manage the loading state of the profile
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  
  // State to store the user profile data
  const [userProfile, setUserProfile] = useState(userProfileSession ? userProfileSession : null);

  useEffect(() => {
    // On component mount, re-fetch the user profile from sessionStorage
    const userProfileSession = getLoggedinUser();
    var token = userProfileSession && userProfileSession["token"];

    // Update the user profile and loading state
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  // Return the user profile data, loading state, and token for use in other components
  return { userProfile, loading, token };
};

export { useProfile };
