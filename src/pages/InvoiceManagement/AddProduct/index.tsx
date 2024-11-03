import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import BreadCrumb from "../../../Common/BreadCrumb";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

const AddProduct = () => {
  document.title = "Add Product";
  const firebaseBackend = getFirebaseBackend();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedFiles, setselectedFiles] = useState<any>([]);

  const handleRemoveImage = () => {
    return setselectedFiles([]);
  };

  const handleAcceptedFiles = (files: any) => {
    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  };

  function formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const formik = useFormik({
    initialValues: {
      productName: "",
      productImage: "",
      category: "",
      price: "",
      productDesc: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Please enter your product name"),
      productImage: Yup.mixed().required("Please select an image"),
      category: Yup.string().required("Please enter your category"),
      price: Yup.number().required("Please enter your billed amount"),
      productDesc: Yup.string().required("Please enter product description"),
    }),
    onSubmit: async (values: {
      productName: any;
      productImage: File;
      category: any;
      price: any;
      productDesc: any;
    }) => {
      const newProduct = {
        title: values.productName,
        images: values.productImage, // Handle image upload to Firestore
        category: values.category,
        price: values.price,
        description: values.productDesc,
      };
      console.log("newProduct :>> ", newProduct);
      // Call your method to add the product to Firestore here
      // For example: addProductToFirestore(newProduct);
      try {
        setIsLoading(true);
        await firebaseBackend.addProductToFirestore(newProduct);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
        formik.resetForm();
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Product" title="Add Product" />
          <Row>
            <Col xl={12}>
              <div className="card">
                <div className="card-body">
                  <div className="p-2">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <Form.Label htmlFor="productname">
                          Product Name
                        </Form.Label>
                        <Form.Control
                          id="productname"
                          name="productName"
                          placeholder="Enter Product Name"
                          type="text"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.productName}
                          isInvalid={
                            formik.touched.productName &&
                            !!formik.errors.productName
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.productName}
                        </Form.Control.Feedback>
                      </div>

                      <Dropzone
                        isInvalid={
                          formik.touched.productImage &&
                          !!formik.errors.productImage
                        }
                        onDrop={(acceptedFiles: any) => {
                          handleAcceptedFiles(acceptedFiles);
                          formik.setFieldValue(
                            "productImage",
                            acceptedFiles[0].name
                          ); // Set image name in Formik
                        }}
                      >
                        {({ getRootProps }: any) => (
                          <div className="dropzone dz-clickable text-center">
                            <div
                              className="dz-message needsclick"
                              {...getRootProps()}
                            >
                              <div className="mb-3">
                                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                              </div>
                              <h4>Drop files here or click to upload.</h4>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                      <div className="list-unstyled mb-0" id="file-previews">
                        {selectedFiles.map((f: any, i: number) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    {/* <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    > */}
                                    {f.name}
                                    {/* </Link> */}
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                  <button
                                    type="button"
                                    className="btn-close p-3"
                                    onClick={handleRemoveImage}
                                  ></button>
                                </Row>
                              </div>
                            </Card>
                          );
                        })}
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.productImage}
                        </Form.Control.Feedback>
                      </div>

                      <Row className="mt-3">
                        <Col md={6}>
                          <div className="mb-3">
                            <Form.Label
                              htmlFor="choices-single-default"
                              className="form-label"
                            >
                              Category
                            </Form.Label>
                            <Form.Select
                              className="form-select"
                              data-trigger
                              name="category"
                              id="choices-single-category"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.category}
                              isInvalid={
                                formik.touched.category &&
                                !!formik.errors.category
                              }
                            >
                              <option value="">Select</option>
                              <option value="EL">Electronic</option>
                              <option value="FA">Fashion</option>
                              <option value="FI">Fitness</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.category}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Label htmlFor="price">
                              Product Price
                            </Form.Label>
                            <Form.Control
                              id="price"
                              name="price"
                              placeholder="Enter Price"
                              type="text"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.price}
                              isInvalid={
                                formik.touched.price && !!formik.errors.price
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.price}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Row>

                      <div className="mb-3">
                        <Form.Label htmlFor="productdesc">
                          Product Description
                        </Form.Label>
                        <textarea
                          className={`form-control ${
                            formik.touched.productDesc &&
                            formik.errors.productDesc
                              ? "is-invalid"
                              : ""
                          }`}
                          id="productdesc"
                          name="productDesc"
                          placeholder="Enter Description"
                          rows={4}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.productDesc}
                        ></textarea>
                        {formik.touched.productDesc &&
                          formik.errors.productDesc && (
                            <div className="invalid-feedback">
                              {formik.errors.productDesc}
                            </div>
                          )}
                      </div>

                      <div className="hstack gap-2 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span
                              className="spinner-grow spinner-grow-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          type="reset"
                          className="btn btn-light"
                          onClick={() => {
                            formik.resetForm();
                            handleRemoveImage();
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddProduct;
