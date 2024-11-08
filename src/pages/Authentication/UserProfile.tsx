import React, { useState, useEffect } from "react";
import { Col, Container, Row,Card, Alert, Button, Form  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoDark from "../../assets/images/logo-dark.png"

import { isEmpty } from "lodash";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../Common/withRouter";

import avatar from "../../assets/images/users/avatar-1.jpg";

// actions
import { createSelector } from "reselect";
import { editProfile, resetProfileFlag } from "../../slices/profile/thunk";

const UserProfile = () => {
  document.title = "User Profile ";

  const dispatch: any = useDispatch();

  const [email, setemail] = useState("admin@gmail.com");
  const [idx, setidx] = useState("1");

  const [userName, setUserName] = useState("Admin");
  const [profileImage, setProfileImage] = useState(avatar);

  const selectLayoutState = (state: any) => state.Profile;
  const userprofileData = createSelector(
    selectLayoutState,
    (state:any) => ({
      user: state.user,
      success: state.success,
      error: state.error
    })
  );
  // Inside your component
  const {
    user, success, error
  } = useSelector(userprofileData);


  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const storedUser = sessionStorage.getItem("authUser");
      if (storedUser) {
        const obj = JSON.parse(storedUser || "{}");

        // if (!isEmpty(user)) {
        //   obj.data.first_name = user.first_name;
        //   sessionStorage.removeItem("authUser");
        //   sessionStorage.setItem("authUser", JSON.stringify(obj));
        // }

        //setUserName(obj.data.first_name || obj.displayName);
       // setemail(obj.data.email || obj.email);
       // setidx(obj.data._id || "1");

        setTimeout(() => {
          dispatch(resetProfileFlag());
        }, 3000);
      }
    }
  }, [dispatch, user]);



  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
  
    initialValues: {
      first_name: userName || 'Admin',
      email: email || 'admin@gmail.com',
      phone: '',
      password: '',
      city: '',
      street: '',
      idx: idx || "1",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your User Name"),
      email: Yup.string().email("Invalid email address").required("Please Enter Your Email"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Please Enter Your Phone Number"),
      password: Yup.string().min(6, "Password must be at least 6 characters"),
      city: Yup.string().required("Please Enter Your City"),
      street: Yup.string().required("Please Enter Your Street"),
    }),
    onSubmit: (values: any) => {
      dispatch(editProfile(values));
    },
  });
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        if (reader.result) {
          setProfileImage(reader.result.toString()); // Update the state with the selected image
        }
      };
  
      reader.readAsDataURL(file); // Convert the file to a base64 string
    }
  };
  

  return (
    <React.Fragment>
      <div className="account-pages">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={11}>
                            <div className="auth-full-page-content d-flex min-vh-100 py-sm-5 py-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100 py-0 py-xl-4">

                                        <div className="text-center mb-5">
                                            <Link to="/">
                                                <span className="logo-lg">
                                                    <img src={logoDark} alt="" height="21" />
                                                </span>
                                            </Link>
                                        </div>

                                        <Row>
                                            <Col lg="12">
                                            {error && error ? <Alert variant="danger">{error}</Alert> : null}
                                            {success ? <Alert variant="success">Username Updated To {userName}</Alert> : null}

                                            <Card>
                                                <Card.Body>
                                                <div className="d-flex">
                                                <div className="mx-3 position-relative">
                                                  {/* Avatar Image */}
                                                  <img
                                                    src={profileImage}
                                                    alt="Profile"
                                                    className="avatar-md rounded-circle img-thumbnail"
                                                    onClick={() => document.getElementById("profileImageInput")?.click()}
                                                    style={{ cursor: "pointer" }}
                                                  />

                                                  {/* Hidden File Input */}
                                                  <input
                                                    type="file"
                                                    id="profileImageInput"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    style={{ display: "none" }}
                                                  />
                                                </div>

                                                    <div className="flex-grow-1 align-self-center">
                                                    <div className="text-muted">
                                                        <h5>{userName || "admin"}</h5>
                                                        <p className="mb-1">{email}</p>
                                                        <p className="mb-0">Id no: #{idx}</p>
                                                    </div>
                                                    </div>
                                                </div>
                                                </Card.Body>
                                            </Card>
                                            </Col>
                                        </Row>

                                        <h4 className="card-title mb-4">Change User Info</h4>

                                        <Card>
                                          <Card.Body>
                                            <Form
                                              className="form-horizontal"
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                              }}
                                            >
                                              {/* User Name Field */}
                                              <Form.Group className="mb-3">
                                                <Form.Label>User Name</Form.Label>
                                                <Form.Control
                                                  name="first_name"
                                                  placeholder="Enter User Name"
                                                  type="text"
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  value={validation.values.first_name || ""}
                                                  isInvalid={validation.touched.first_name && validation.errors.first_name}
                                                />
                                                {validation.touched.first_name && validation.errors.first_name && (
                                                  <Form.Control.Feedback type="invalid">
                                                    {validation.errors.first_name}
                                                  </Form.Control.Feedback>
                                                )}
                                              </Form.Group>

                                              {/* Email Field */}
                                              <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                  name="email"
                                                  placeholder="Enter Email"
                                                  type="email"
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  value={validation.values.email || ""}
                                                  isInvalid={validation.touched.email && validation.errors.email}
                                                />
                                                {validation.touched.email && validation.errors.email && (
                                                  <Form.Control.Feedback type="invalid">
                                                    {validation.errors.email}
                                                  </Form.Control.Feedback>
                                                )}
                                              </Form.Group>

                                              {/* Phone Number Field */}
                                              <Form.Group className="mb-3">
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control
                                                  name="phone"
                                                  placeholder="Enter Phone Number"
                                                  type="text"
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  value={validation.values.phone || ""}
                                                  isInvalid={validation.touched.phone && validation.errors.phone}
                                                />
                                                {validation.touched.phone && validation.errors.phone && (
                                                  <Form.Control.Feedback type="invalid">
                                                    {validation.errors.phone}
                                                  </Form.Control.Feedback>
                                                )}
                                              </Form.Group>

                                              {/* Password Field */}
                                              <Form.Group className="mb-3">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                  name="password"
                                                  placeholder="Enter Password"
                                                  type="password"
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  value={validation.values.password || ""}
                                                  isInvalid={validation.touched.password && validation.errors.password}
                                                />
                                                {validation.touched.password && validation.errors.password && (
                                                  <Form.Control.Feedback type="invalid">
                                                    {validation.errors.password}
                                                  </Form.Control.Feedback>
                                                )}
                                              </Form.Group>

                                              {/* City Field */}
                                              <Form.Group className="mb-3">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                  name="city"
                                                  placeholder="Enter City"
                                                  type="text"
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  value={validation.values.city || ""}
                                                  isInvalid={validation.touched.city && validation.errors.city}
                                                />
                                                {validation.touched.city && validation.errors.city && (
                                                  <Form.Control.Feedback type="invalid">
                                                    {validation.errors.city}
                                                  </Form.Control.Feedback>
                                                )}
                                              </Form.Group>

                                              {/* Street Field */}
                                              <Form.Group className="mb-3">
                                                <Form.Label>Street</Form.Label>
                                                <Form.Control
                                                  name="street"
                                                  placeholder="Enter Street"
                                                  type="text"
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  value={validation.values.street || ""}
                                                  isInvalid={validation.touched.street && validation.errors.street}
                                                />
                                                {validation.touched.street && validation.errors.street && (
                                                  <Form.Control.Feedback type="invalid">
                                                    {validation.errors.street}
                                                  </Form.Control.Feedback>
                                                )}
                                              </Form.Group>

                                              {/* Hidden ID Field */}
                                              <Form.Control name="idx" value={idx} type="hidden" />

                                              <div className="text-center mt-4">
                                                <Button type="submit" variant="danger">
                                                  Update Profile
                                                </Button>
                                              </div>
                                            </Form>
                                          </Card.Body>
                                        </Card>


                                        
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile);
