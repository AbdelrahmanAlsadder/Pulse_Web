import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
//import images
import avatar1 from "../assets/images/users/avatar-4.jpg";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getFirebaseBackend } from "../helpers/firebase_helper";

const ProfileDropdown = () => {
  const [userName, setUserName] = useState<any>("");
  const firebaseBackend = getFirebaseBackend();
  const profiledropdownData = createSelector(
    (state: any) => state.Profile,
    (user: any) => user
  );

  // Inside your component
  const user = useSelector(profiledropdownData);
  const loadUserName = async (uid: String) => {
    try {
      const data = await firebaseBackend.getUserDetailsByUid(uid);
      setUserName(data ? data.username : "Admin");
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
    }
  };
  useEffect(() => {
    const authUser: any = sessionStorage.getItem("authUser");
    if (authUser) {
      const obj = JSON.parse(authUser);
      if (obj.uid) loadUserName(obj.uid);
    }
  }, [userName, user]);

  return (
    <React.Fragment>
      <Dropdown className="header-item">
        <Dropdown.Toggle
          type="button"
          className="btn bg-transparent border-0 arrow-none"
          id="page-header-user-dropdown"
        >
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block fw-medium user-name-text fs-16">
                {userName} <i className="las la-angle-down fs-12 ms-1"></i>
              </span>
            </span>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <Dropdown.Item className="dropdown-item" href="/user-profile">
            <i className="bx bx-user fs-15 align-middle me-1"></i>{" "}
            <span key="t-profile">Profile</span>
          </Dropdown.Item>
          <div className="dropdown-divider"></div>
          <Dropdown.Item
            className="dropdown-item text-danger"
            href={process.env.PUBLIC_URL + "/logout"}
          >
            <i className="bx bx-power-off fs-15 align-middle me-1 text-danger"></i>{" "}
            <span key="t-logout">Logout</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
