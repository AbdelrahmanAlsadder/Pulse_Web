import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddProduct = () => {
  document.title = "Add Product";
  const firebaseBackend = getFirebaseBackend();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedFiles, setselectedFiles] = useState<any>([]);

  const [categories, setCategories] = useState<any[]>([]); // State for categories

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = await firebaseBackend.fetchCategories();
        setCategories(categoryCollection);

        console.log("Fetched categories:", categoryCollection);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, [firebaseBackend]);

  // useEffect(() => {
  //   const loadProducts = async () => {
  //     try {
  //       setIsLoading(true);
  //       const productsList = await firebaseBackend.fetchProducts();
  //       setProducts(productsList);
  //     } catch (error) {
  //       console.error("Error loading products:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   loadProducts();
  // }, [firebaseBackend]);

  const handleRemoveImage = () => {
    return setselectedFiles([]);
  };


  //comment this out when you get the firebase storage for images and delete the handle accepted files function
  // don't forget to change in line 216
   // const uploadImageToFirebase = async (file) => {
        //   const storageRef = firebase.storage().ref(`products/${file.name}`);
        //   const uploadTask = await storageRef.put(file);
        //   return await uploadTask.ref.getDownloadURL();
        // };

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
      productScientificName: "",
      productImage: "",
      category: "",
      price: "",
      quantity: "",
      expiryDate: "",
      productDesc: "",
      status:"0",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Please enter your product commercial name"),
      productScientificName: Yup.string().required("Please enter your product scientific name"),
      productImage: Yup.mixed().required("Please select an image"),
      category: Yup.string().required("Please enter your category"),
      price: Yup.number().required("Please enter price"),
      quantity: Yup.number().required("Please enter the quantity"),
      expiryDate: Yup.date().required("Please enter the expiry date"),
      productDesc: Yup.string().required("Please enter product description"),
    }),
    onSubmit: async (values: {
      productName: any;
      productScientificName: any;
      productImage: null;
      category: any;
      price: any;
      quantity: any;
      expiryDate: any;
      productDesc: any;
      status:"0",
    }) => {
      const newProduct = {
        title: values.productName,
        scientificTitle: values.productScientificName,
        // images: values.productImage, // Handle image upload to Firestore
        category: values.category,
        price: values.price,
        quantity: values.quantity,
        expiryDate: values.expiryDate,
        description: values.productDesc,
        status:"0",
      };
      console.log("newProduct :>> ", newProduct);
      // Call your method to add the product to Firestore here
      // For example: addProductToFirestore(newProduct);
      try {
        setIsLoading(true);
        await firebaseBackend.addProductToFirestore(newProduct, values.productImage);  // Pass both the product data and image file
        toast.success("Product Added Successfully", { autoClose: 2000 });
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Error adding product", { autoClose: 2000 });
      } finally {
        setIsLoading(false);
        formik.resetForm();
        handleRemoveImage();
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          
          <Row>
            <Col xl={12}>
              <div className="card">
                <div className="card-body">
                  <div className="p-2">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <Form.Label htmlFor="productname">
                          Product Commercial Name
                        </Form.Label>
                        <Form.Control
                          id="productname"
                          name="productName"
                          placeholder="Enter Product Commercial Name"
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

                      <div className="mb-3">
                        <Form.Label htmlFor="productname">
                          Product Scientific Name
                        </Form.Label>
                        <Form.Control
                          id="productscientificname"
                          name="productScientificName"
                          placeholder="Enter Product Scientific Name"
                          type="text"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.productScientificName}
                          isInvalid={
                            formik.touched.productScientificName &&
                            !!formik.errors.productScientificName
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.productScientificName}
                        </Form.Control.Feedback>
                      </div>

                      <Dropzone
  isInvalid={
    formik.touched.productImage && !!formik.errors.productImage
  }
  accept={{ 'image/jpeg': ['.jpg', '.jpeg'] }} // Only accept JPG files
  onDrop={(acceptedFiles: any) => {
    // Filter to ensure only JPG files are accepted
    const jpgFiles = acceptedFiles.filter(
      (file: File) => file.type === "image/jpeg" || file.type === "image/jpg"
    );

    if (jpgFiles.length > 0) {
      handleAcceptedFiles(jpgFiles);
      formik.setFieldValue("productImage", jpgFiles[0]); // Set image name in Formik
    } else {
      alert("Only JPG files are allowed!"); // Alert if the file is not a JPG
    }
  }}
>
  {({ getRootProps, getInputProps }: any) => (
    <div className="dropzone dz-clickable text-center">
      <div
        className="dz-message needsclick"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="mb-3">
          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
        </div>
        <h4>Drop JPG files here or click to upload.</h4>
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
                              {categories.map((category) => (
                                <option
                                  key={category.id}
                                  value={category.title}
                                >
                                  {category.title}
                                </option>
                              ))}
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
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Label htmlFor="quantity">
                              Product Quantity
                            </Form.Label>
                            <Form.Control
                              id="quantity"
                              name="quantity"
                              placeholder="Enter Quantity"
                              type="text"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.quantity}
                              isInvalid={
                                formik.touched.quantity &&
                                !!formik.errors.quantity
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.quantity}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                        <Col>
                          <div className="mb-3">
                            <Form.Label htmlFor="expiryDate">
                              Expiry Date
                            </Form.Label>
                            <Form.Control
                              id="expiryDate"
                              name="expiryDate"
                              type="date"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.expiryDate}
                              isInvalid={
                                formik.touched.expiryDate &&
                                !!formik.errors.expiryDate
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.expiryDate}
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
                            "Add"
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
