import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Form,
  Alert,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthCarousel from "../AuthenticationInner/AuthCarousel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { toast, Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { getFirebaseBackend } from "../../helpers/firebase_helper";

const Register = () => {
  document.title = "Register ";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // initialize relavant method of both Auth
  const fireBaseBackend = getFirebaseBackend();

  const [passwordShow, setPasswordShow] = useState<any>(false);
  const [timer, setTimer] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);
  const successnotify = () =>
    toast("Your application was successfully sent", {
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: false,
      className: "bg-success text-white",
      transition: Slide,
    });
  const errornotify = () =>
    toast("Error ! An error occurred.", {
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: false,
      className: "bg-danger text-white",
      transition: Slide,
    });

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      username: "",
      password: "",
      phone: "",
      city: "",
      street: "",
      CommercialRegister: null,
    },
    
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Email"),
      username: Yup.string().required("Please Enter Username"),
      password: Yup.string()
        .required("Please Enter Password")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      phone: Yup.string()
        .required("Please Enter Phone Number")
        .matches(/^[0-9]+$/, "Phone number must only contain numbers")
        .min(10, "Phone number must be at least 10 digits"),
      CommercialRegister: Yup.mixed().required(
        "Please upload the Commercial Register"
      ),city: Yup.string().required("Please Enter City"),
      street: Yup.string().required("Please Enter Street"),
    }),
    onSubmit: async (values: any) => {
      setLoader(true);
      try {
        let response;

        response = await fireBaseBackend.registerUser(
          validation.values.email,
          validation.values.password
        );

        if (response)
          await fireBaseBackend.addNewUserToFirestore(validation.values);

        successnotify();
        navigate("/login");
      } catch (error) {
        errornotify();
      } finally {
        setLoader(false);
      }
    },
  });
  const selectAccount = createSelector(
    (state: any) => state.Account,
    (account: any) => ({
      success: account.success,
      error: account.error,
    })
  );

  const { error, success } = useSelector(selectAccount);


  return (
    <React.Fragment>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={11}>
              <div className="auth-full-page-content d-flex min-vh-100 py-sm-5 py-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100 py-0 py-xl-4">
                   

                    <Card className="my-auto overflow-hidden">
                      <Row className="g-0">
                        <Col lg={6}>
                          <div className="p-lg-5 p-4">
                            <div className="text-center">
                              <h5 className="mb-0">Create New Account</h5>
                            </div>

                            <div className="mt-4">
                              {success && (
                                <Alert variant="success">
                                  Your Redirect to Login Page in {timer} Seconds
                                </Alert>
                              )}
                              <Form
                                className="needs-validation"
                                action="#"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  validation.handleSubmit();
                                  return false;
                                }}
                              >
                                <Form.Group
                                  className="mb-3"
                                  controlId="useremail"
                                >
                                  <Form.Label>
                                    Email <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    className="form-control bg-light border-light"
                                    placeholder="Enter email address"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.email || ""}
                                    isInvalid={
                                      validation.touched.email &&
                                      validation.errors.email
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.email &&
                                  validation.errors.email ? (
                                    <Form.Control.Feedback type="invalid">
                                      {validation.errors.email}
                                    </Form.Control.Feedback>
                                  ) : null}
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="username"
                                >
                                  <Form.Label>
                                    Username{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    className="form-control bg-light border-light"
                                    placeholder="Enter username"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.username || ""}
                                    isInvalid={
                                      validation.touched.username &&
                                      validation.errors.username
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.username &&
                                  validation.errors.username ? (
                                    <Form.Control.Feedback type="invalid">
                                      {validation.errors.username}
                                    </Form.Control.Feedback>
                                  ) : null}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label htmlFor="password-input">
                                    Password{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <InputGroup className="position-relative auth-pass-inputgroup">
                                    <Form.Control
                                      onPaste={(e) => e.preventDefault()}
                                      placeholder="Enter password"
                                      id="password-input"
                                      type={!passwordShow ? "password" : "text"}
                                      name="password"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.password || ""}
                                      isInvalid={
                                        validation.touched.password &&
                                        validation.errors.password
                                          ? true
                                          : false
                                      }
                                    />

                                    <Button
                                      variant="link"
                                      className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                      type="button"
                                      id="password-addon"
                                      onClick={() =>
                                        setPasswordShow(!passwordShow)
                                      }
                                    >
                                      <i className="ri-eye-fill align-middle"></i>
                                    </Button>
                                    {validation.touched.password &&
                                    validation.errors.password ? (
                                      <Form.Control.Feedback type="invalid">
                                        <div>{validation.errors.password}</div>
                                      </Form.Control.Feedback>
                                    ) : null}
                                  </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="phone">
                                  <Form.Label>
                                    Phone Number{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="phone"
                                    className="form-control bg-light border-light"
                                    placeholder="Enter phone number"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.phone || ""}
                                    isInvalid={
                                      validation.touched.phone &&
                                      !!validation.errors.phone
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {validation.errors.phone}
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="city">
  <Form.Label>
    City <span className="text-danger">*</span>
  </Form.Label>
  <Form.Control
    type="text"
    name="city"
    className="form-control bg-light border-light"
    placeholder="Enter city"
    onChange={validation.handleChange}
    onBlur={validation.handleBlur}
    value={validation.values.city || ""}
    isInvalid={validation.touched.city && !!validation.errors.city}
  />
  {validation.touched.city && validation.errors.city ? (
    <Form.Control.Feedback type="invalid">
      {validation.errors.city}
    </Form.Control.Feedback>
  ) : null}
</Form.Group>

<Form.Group className="mb-3" controlId="street">
  <Form.Label>
    Street <span className="text-danger">*</span>
  </Form.Label>
  <Form.Control
    type="text"
    name="street"
    className="form-control bg-light border-light"
    placeholder="Enter street"
    onChange={validation.handleChange}
    onBlur={validation.handleBlur}
    value={validation.values.street || ""}
    isInvalid={validation.touched.street && !!validation.errors.street}
  />
  {validation.touched.street && validation.errors.street ? (
    <Form.Control.Feedback type="invalid">
      {validation.errors.street}
    </Form.Control.Feedback>
  ) : null}
</Form.Group>
                                {/* Legal Document Upload */}
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    Commercial Register{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="file"
                                    name="CommercialRegister"
                                    accept="application/pdf" // Restricts to PDF files only
                                    onChange={(e) => {
                                      const file = (
                                        e.currentTarget as HTMLInputElement
                                      ).files?.[0];
                                      validation.setFieldValue(
                                        "CommercialRegister",
                                        file
                                      );
                                    }}
                                    onBlur={validation.handleBlur}
                                    isInvalid={
                                      validation.touched.CommercialRegister &&
                                      !!validation.errors.CommercialRegister
                                    }
                                  />
                                  {validation.touched.CommercialRegister &&
                                  validation.errors.CommercialRegister ? (
                                    <Form.Control.Feedback type="invalid">
                                      {validation.errors.CommercialRegister}
                                    </Form.Control.Feedback>
                                  ) : null}
                                </Form.Group>

                             

                                <div className="mt-2">
                                  <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                  >
                                    {loader && (
                                      <Spinner size="sm" animation="border" />
                                    )}{" "}
                                    {"  "}
                                    Sign Up
                                  </button>
                                </div>

                                <div className="mt-4 text-center">
                                  <div className="signin-other-title">
                                    <h5 className="fs-15 mb-3 title">
                                     Have an Acoount
                                    </h5>
                                  </div>

                                  
                                </div>

                                <div className="mt-4 text-center">
                                  <p className="mb-0">
                                    Already Have an Account ?{" "}
                                    <Link
                                      to="/login"
                                      className="fw-medium text-primary text-decoration-underline"
                                    >
                                      {" "}
                                      Signin{" "}
                                    </Link>{" "}
                                  </p>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </Col>

                        <AuthCarousel />
                      </Row>
                    </Card>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Register;
