import React,{useState,useEffect} from 'react'
import withRouter from '../../Common/withRouter';
import { Container, Row, Col, Card, Form, Button,Alert,Spinner } from 'react-bootstrap';
import logoDark from "../../assets/images/logo-dark.png"
import { Link } from 'react-router-dom';
import AuthCarousel from '../AuthenticationInner/AuthCarousel';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { loginUser, resetLoginFlag, socialLogin } from '../../slices/thunk';
import * as Yup from "yup";
import { toast, Slide, ToastContainer } from "react-toastify";

const Login = (props:any) => {
  document.title = "Login ";
  const [loader, setLoader] = useState<boolean>(false);
  const errornotify1 = () =>
    toast("Incorrect Email or Password.", {
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: false,
      className: "bg-danger text-white",
      transition: Slide,
      autoClose: 3000,
    });
  const dispatch: any = useDispatch();
    const selectAccountAndLogin = createSelector(
        (state: any) => state.Account,
        (state: any) => state.Login,
        (account:any, login:any) => ({
          user: account.user,
          error: login.error,
          loading: login.loading,
          errorMsg: login.errorMsg,
        })
      );
      


    const { user, error, loading, errorMsg } = useSelector(selectAccountAndLogin);

    const [userLogin, setUserLogin] = useState<any>([]);
   

    useEffect(() => {
        if (user && user) {
            const updatedUserData = "";
            const updatedUserPassword = "";
            setUserLogin({
                email: updatedUserData,
                password: updatedUserPassword
            });
        }
    }, [user]);

    //  validation
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    

    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email:"",
            password:"",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values:any) => { 
            dispatch(loginUser(values, props.router.navigate));
            if (error) { // Check if there's an error after login
                errornotify1(); // Show error notification
            }
            
           
        }
    });

    const signIn = (type:any) => {
        dispatch(socialLogin(type, props.router.navigate));
    };



    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                errornotify1();
                dispatch(resetLoginFlag());
            }, 3000);
        }

    }, [dispatch, errorMsg]);
    
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
                                                    <img src={logoDark} alt="" height="45" width="180"/>
                                                </span>
                                            </Link>
                                        </div>

                                        <Card className="my-auto overflow-hidden">
                                            <Row className="g-0">
                                                <Col lg={6}>
                                                    <Card.Body className="p-lg-5 p-4">
                                                        <div className="text-center">
                                                            <h5 className="mb-0">Welcome Back !</h5>
                                                            <p className="text-muted mt-2">Sign in to continue to PULSE.</p>
                                                        </div>

                                                        <div className="mt-4">
                                                        {error && error ? (<Alert variant="danger"> {error} </Alert>) : null}
                                                        <Form
                                                            action='#'
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                validation.handleSubmit();
                                                                return false;
                                                            }}
                                                        >
                                                                <Form.Group className="mb-3" controlId="username">
                                                                    <Form.Label>Email</Form.Label>
                                                                    <div className="position-relative">
                                                                    <Form.Control
                                                                        type="email"
                                                                        name='email'
                                                                        id='email'
                                                                        className="form-control bg-light border-light password-input"
                                                                        placeholder="Enter username"
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.email || ""}
                                                                        isInvalid={
                                                                            validation.touched.email && validation.errors.email ? true : false
                                                                        }

                                                                    />
                                                                    {validation.touched.email && validation.errors.email ? (
                                                                        <Form.Control.Feedback type="invalid">{validation.errors.email}</Form.Control.Feedback>
                                                                    ) : null}
                                                                </div>
                                                                </Form.Group>                                                                

                                                                <Form.Group className="mb-3" controlId="password-input">
                                                                <div className="float-end">
                                                                    <Link to="/forgot-password" className="text-muted" >Forgot password?</Link>
                                                                </div>
                                                                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                                                <div className="position-relative auth-pass-inputgroup mb-3">
                                                                    <Form.Control
                                                                        type={passwordShow ? "text" : "password"}
                                                                        name='password'
                                                                        className="form-control bg-light border-light pe-5 password-input"
                                                                        placeholder="Enter password"
                                                                        value={validation.values.password || ""}
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        isInvalid={
                                                                            validation.touched.password && validation.errors.password ? true : false
                                                                        }
                                                                    />
                                                                    {validation.touched.password && validation.errors.password ? (
                                                                        <Form.Control.Feedback type="invalid">{validation.errors.password}</Form.Control.Feedback>
                                                                    ) : null}
                                                                    <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}>
                                                                        <i className="ri-eye-fill align-middle"></i>
                                                                    </button>
                                                                </div>
                                                            </Form.Group>

                                                       

                                                                <div className="mt-2">
                                                                <Button 
                                                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center" 
                                                                    type="submit" 
                                                                    disabled={loading}
                                                                >
                                                                    {loading && <Spinner animation="border" size="sm" role="status" className="me-2" />}
                                                                    Sign In
                                                                </Button>
                                                                </div>

                                                                <div className="mt-4 text-center">
                                                                    <div className="signin-other-title">
                                                                        <h5 className="fs-15 mb-3 title"></h5>
                                                                    </div>

                                                               
                                                                </div>

                                                                <div className="mt-4 text-center">
                                                                    <p className="mb-0">Don't have an account ? <Link to="/register" className="fw-medium text-primary text-decoration-underline"> Signup now </Link> </p>
                                                                </div>
                                                            </Form>
                                                        </div>

                                                    </Card.Body>
                                                </Col>

                                                <AuthCarousel/>
                                            </Row>
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

export default withRouter(Login);
