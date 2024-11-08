import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import dummy from "../../assets/images/users/user-dummy-img.jpg";
import * as Yup from "yup";

import { editUsers as onEditUsers } from '../../slices/thunk';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import moment from 'moment';
import FlatPickr from 'react-flatpickr';
import { PatternFormat } from 'react-number-format';
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { toast } from "react-toastify";

interface usereditProps {
    isShow: any,
    handleClose: any,
    edit: any,
    // isEdit: any
}

const EditUsers = ({ isShow, handleClose, edit }: usereditProps) => {
    const firebaseBackend = getFirebaseBackend();
    // image
    const [selectedImage, setSelectedImage] = useState<any>();

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            formik.setFieldValue('memberImage', e.target.result);
            setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const dispatch = useDispatch();

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: (edit && edit.id) || '',
            memberName: (edit && edit.username) || '',
            memberImage: (edit && edit.picture) || '',
            email: (edit && edit.email) || '',
            mobile: (edit && edit.phone) || '',
            registeredOn: (edit && edit.createdDtm) || '',
            status: (edit && edit.status) || ''
        },
        validationSchema: Yup.object({
            memberName: Yup.string().required("Please Enter Member Name"),
            memberImage: Yup.string().required("Please Select Member Name"),
            email: Yup.string().email().matches(/^(?!.*@[^,]*,)/).required("Please Enter Your Email"),
            mobile: Yup.string().required('Please Enter Your Mobile Number'),
            registeredOn: Yup.string().required('Please Select registered date'),
            status: Yup.string().required("Please choose Your status"),
        }),

        onSubmit: async (values: any) => {
            console.log("Submitting form with values:", values);
            await firebaseBackend.updateUserById(edit.id, values);
            formik.resetForm();
            toast.success("Product Edited Successfully", { autoClose: 2000 });
            handleClose(true);
          },
    });   

    useEffect(() => {
        setSelectedImage(edit?.memberImage);
    }, [edit])

    return (
        <React.Fragment>
            <Modal centered show={isShow} onHide={handleClose} style={{ display: "block" }} tabIndex={-1}>
                <div className="modal-content border-0">
                    <Modal.Header className="p-4 pb-0">
                        <Modal.Title as="h5">Edit User Status</Modal.Title>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form autoComplete="off" onSubmit={formik.handleSubmit}>
                            <div className="text-center">
                                <div className="position-relative d-inline-block">
                                    <div className="position-absolute bottom-0 end-0">
                                        <Form.Label htmlFor="product-image-input" className="mb-0" data-bs-toggle="tooltip" data-bs-placement="right" title="Select Image">
                                           
                                        </Form.Label>
                                        <Form.Control name="memberImage" className="form-control d-none" value="" id="product-image-input" type="file" accept="image/png, image/gif, image/jpeg" onChange={handleImageChange} />
                                    </div>
                                  
                                </div>
                                {/* {formik.errors.memberImage && formik.touched.memberImage ? (
                                    <Form.Control.Feedback type="invalid" className='d-block'> {formik.errors.memberImage} </Form.Control.Feedback>
                                ) : null} */}
                            </div>

                            <div className="mb-3">
                                <Form.Label htmlFor="users">Member Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="memberName"
                                    name="memberName"
                                    placeholder="Enter member name"
                                    className='bg-light text-muted'
                                    disabled
                                    value={formik.values.memberName || ''}
                                    // onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    // isInvalid={!!formik.errors.memberName}
                                />
                                {/* {formik.errors.memberName && formik.touched.memberName ? (
                                    <Form.Control.Feedback type="invalid" className='d-block'>{formik.errors.memberName}</Form.Control.Feedback>
                                ) : null} */}
                            </div>
                            <div className="mb-3">
                                <Form.Label htmlFor="Email-input">Email<span className="text-danger ">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="Email-input"
                                    name="email"
                                    className='bg-light text-muted'
                                    disabled
                                    placeholder="Enter Your email"
                                    value={formik.values.email || ''}
                                    // onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.email}
                                />
                                {/* {formik.errors.email && formik.touched.email ? (
                                    <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                                ) : null} */}
                            </div>
                            <div className="mb-3">
                                <Form.Label htmlFor="users">Mobile</Form.Label>
                                <PatternFormat
                                    id="mobile"
                                    name="mobile"
                                    className='form-control bg-light text-muted'
                                    placeholder="Enter Your Mobile Number"
                                    value={formik.values.mobile || ''}
                                    
                                    onBlur={formik.handleBlur}
                                    format="###-###-####"
                                    disabled />
                                {/* {formik.errors.mobile && formik.touched.mobile ? (
                                    <Form.Control.Feedback type="invalid" className='d-block'>{formik.errors.mobile}</Form.Control.Feedback>
                                ) : null} */}
                            </div>
                            <Row>
                                
                                <Col lg={12}>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>                                       
                                        <Form.Select
                                            id="paymentType"
                                            name="status"
                                            placeholder="Enter Payment type"
                                            value={formik.values.status || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={!!formik.errors.status}
                                        >
                                            <option disabled>Select Status</option>
                                            <option value="0">Pending</option>
                                            <option value="1">Admin</option>
                                            <option value="2">Warehouse</option>
                                            <option value="3">Pharmacy</option>
                                            <option value="-1">Rejected</option>
                                            
                                        </Form.Select>
                                        {formik.errors.status && formik.touched.status ? (
                                            <Form.Control.Feedback type="invalid" className='d-block'>{formik.errors.status}</Form.Control.Feedback>
                                        ) : null}
                                    </div>
                                </Col>
                            </Row>
                            <div className="hstack gap-2 justify-content-end">
                                <Button type="button" className="btn btn-light" onClick={handleClose}>Close</Button>
                                <Button type="submit" className="btn btn-success" onClick={handleClose}>Edit User</Button>
                            </div>

                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default EditUsers
