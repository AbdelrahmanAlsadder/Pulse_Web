import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap"; // Importing Dropdown component from react-bootstrap for a dropdown menu
import { useSelector } from "react-redux"; // To access Redux store state
import { createSelector } from "reselect"; // To create a selector function for Redux state
import { getFirebaseBackend } from "../helpers/firebase_helper"; // A helper function to get Firebase backend instance


const ProfileDropdown = () => {
  // Declare state for storing the username and image of the user
  const [userName, setUserName] = useState<string>(""); // Default is empty string
  const [userImage, setUserImage] = useState<string>(""); // Default is empty string
  
  const firebaseBackend = getFirebaseBackend(); // Get Firebase backend instance to fetch user details

  // Create a selector to retrieve user profile from Redux state
  const profiledropdownData = createSelector(
    (state: any) => state.Profile, // Access the Profile state from Redux
    (user: any) => user // Return the user object
  );
  
  // Use Redux's useSelector hook to access the profile data from Redux state
  const user = useSelector(profiledropdownData);

  // Function to load user details (username and image) from Firebase based on the user ID (uid)
  const loadUserName = async (uid: string) => {
    try {
      const data = await firebaseBackend.getUserDetailsByUid(uid); // Fetch user data by UID from Firebase
      setUserName(data ? data.username : "Admin"); // Set username, defaulting to "Admin" if not found
      setUserImage(data ? data.picture : ""); // Set user image if available, otherwise empty
    } catch (error) {
      console.error("Error loading user details:", error); // Handle any errors that occur during the fetch
    }
  };

  // useEffect hook to load user details when the component mounts or when `user` changes
  useEffect(() => {
    const authUser = sessionStorage.getItem("authUser"); // Retrieve authUser data from sessionStorage
    if (authUser) {
      const obj = JSON.parse(authUser); // Parse the authUser JSON data
      if (obj?.uid) loadUserName(obj.uid); // If UID is available, call loadUserName with the UID
    }
  }, [user]); // The effect will run when the `user` changes

  return (
    <React.Fragment>
      {/* Profile Dropdown Component */}
      <Dropdown className="header-item">
        <Dropdown.Toggle
          type="button"
          className="btn bg-transparent border-0 arrow-none"
          id="page-header-user-dropdown"
        >
          <span className="d-flex align-items-center">
            {/* Profile Image */}
            <img
              className="rounded-circle header-profile-user"
              src={userImage} // Set profile image dynamically
              alt="Header Avatar"
              onError={() => {
                console.error("Failed to load image, falling back to default."); // Fallback in case of image load error
              }}
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block fw-medium user-name-text fs-16">
                {userName || "Loading..."} {/* Display the username, or "Loading..." if it's not set yet */}
                <i className="las la-angle-down fs-12 ms-1"></i> {/* Dropdown icon */}
              </span>
            </span>
          </span>
        </Dropdown.Toggle>

        {/* Dropdown Menu */}
        <Dropdown.Menu className="dropdown-menu-end">
          <Dropdown.Item className="dropdown-item" href="/user-profile">
            <i className="bx bx-user fs-15 align-middle me-1"></i>{" "}
            <span key="t-profile">Profile</span> {/* Link to user profile */}
          </Dropdown.Item>
          <div className="dropdown-divider"></div> {/* Divider in dropdown */}
          <Dropdown.Item
            className="dropdown-item text-danger"
            href={process.env.PUBLIC_URL + "/logout"} // Logout link
          >
            <i className="bx bx-power-off fs-15 align-middle me-1 text-danger"></i>{" "}
            <span key="t-logout">Logout</span> {/* Logout option */}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
