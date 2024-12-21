import React, { useEffect, useState } from "react";

import { Card, Container, Row, Col, Table, Dropdown } from "react-bootstrap";
import logoDark from "../../../assets/images/logo-dark.png";
import logoLight from "../../../assets/images/logo-light.png";
import { useParams } from "react-router-dom";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import moment from "moment";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//jspdf and html are downloaded dependencies so we can download the invoice
// i want it to be downloaded as pdf so i chose jspdf
//html2canvas basicaaly takes a screen shot of the page and then we turn it into pdf
const handleDownload = async () => {
  const element = document.getElementById("demo"); // Target the specific div with id="demo" because i don't want to download the entire screen

  if (!element) {
    toast.error("Invoice content not found!");
    return;
  }

  // Temporarily hide the buttons by setting inline styles
  //so when we take the screen shot of the page the buttons are not showing
  //which means they will not be showing in the downloaded pdf
  const buttons = element.querySelectorAll(".d-print-none");
  buttons.forEach((btn) => {
    (btn as HTMLElement).style.display = "none";
  });

  // Capture the content as a PDF
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`document.pdf`);

  // Restore the buttons after generating the PDF
  buttons.forEach((btn) => {
    (btn as HTMLElement).style.display = ""; // Restore original display style
  });
};

const InvoiceDetails = () => {
  document.title = "Invoice Details ";
  const { orderId } = useParams();

  const [order, setOrder] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();
  console.log("order :>> ", order);

  const loadOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const OrderDetails = await firebaseBackend.getOrderById(orderId);
      setOrder(OrderDetails);
      await loadUserDetails(OrderDetails.user_id);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const loadUserDetails = async (uid: string) => {
    console.log("uid :>> ", uid);
    try {
      setIsLoading(true);
      const userd = await firebaseBackend.getUserDetailsByUid(uid);
      console.log("userd :>> ", userd);
      setUserDetails(userd);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) loadOrder(orderId);
  }, [orderId]);

  if (isLoading) return <div>Loading...</div>;

  if (!order) return <div>Order not found!</div>;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card id="demo">
                <Card.Body>
                  <Row className="p-4">
                    <Col lg={9}>
                      <h3 className="fw-bold mb-4">
                        Invoice: {order.user.username}-{orderId?.slice(0, 5)}
                      </h3>
                      <Row className="g-4">
                        <Col lg={6} className="col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Invoice No
                          </p>
                          <h5 className="fs-16 mb-0">
                            #PULSE-{orderId?.slice(0, 5)}
                          </h5>
                        </Col>

                        <Col lg={6} className="col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Date
                          </p>
                          <h5 className="fs-16 mb-0">
                            <span>
                              {moment(order.date.toDate()).format(
                                "MMMM Do YYYY"
                              )}
                            </span>{" "}
                            <small className="text-muted">
                              {moment(order.date.toDate()).format("h:mm A")}
                            </small>
                          </h5>
                        </Col>

                        <Col lg={6} className="col-6">
                          <p className="text-muted mb-1 fw-medium fs-14">
                            Order Status
                          </p>
                          {(() => {
                            if (
                              order.status.find(
                                (i: { uid: any }) =>
                                  i.uid == firebaseBackend.uuid
                              ).status == -1
                            ) {
                              return (
                                <span className="badge bg-danger-subtle text-danger p-2">
                                  Rejected
                                </span>
                              );
                            }
                            if (
                              order.status.find(
                                (i: { uid: any }) =>
                                  i.uid == firebaseBackend.uuid
                              ).status == 2
                            ) {
                              return (
                                <span className="badge bg-info-subtle text-info p-2">
                                  Completed
                                </span>
                              );
                            }
                          })()}
                        </Col>

                        <Col lg={6} className="col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Total Amount
                          </p>
                          <h5 className="fs-16 mb-0">
                            ${order.totalAmount.toFixed(2)}
                          </h5>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <div className="mt-sm-0 mt-3">
                        <div className="mb-4">
                          <img
                            src={logoDark}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="33"
                            width="150"
                          />
                          <img
                            src={logoLight}
                            className="card-logo card-logo-light"
                            alt="logo light"
                            height="17"
                          />
                        </div>
                      </div>
                      <div className="">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          Shipping Address
                        </h6>
                        <p className="fw-medium mb-2">
                          Pharmacy Name: {userDetails?.username}
                        </p>
                        <p className="text-muted mb-1">
                          City: {userDetails?.city}
                        </p>
                        <p className="text-muted mb-1">
                          Street: {userDetails?.street}
                        </p>
                        <p className="text-muted mb-1">
                          <span>Phone: </span>
                          <span>{userDetails?.phone}</span>
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12}>
                      <Card.Body className="card-body table-responsive p-4">
                        <Table className="table-borderless  text-start table-nowrap align-middle mb-0">
                          <thead>
                            <tr className="table-active">
                              <th scope="col" style={{ width: "50px" }}>
                                #
                              </th>
                              <th scope="col">Product Name</th>
                              <th scope="col">Price</th>
                              <th scope="col">Quantity</th>
                              <th scope="col" className="text-start">
                                Amount
                              </th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map(
                              (product: any, index: number) => (
                                <tr key={index}>
                                  <th scope="row">{index + 1}</th>
                                  <td className="text-start">
                                    <span className="fw-medium">
                                      {product.productDetails.title}
                                    </span>
                                    <p className="text-muted mb-0">
                                      {product.productDetails.description}
                                    </p>
                                  </td>
                                  <td>${product.productDetails.price}</td>
                                  <td>{product.quantity}</td>
                                  <td className="text-start">
                                    $
                                    {(
                                      product.productDetails.price *
                                      product.quantity
                                    ).toFixed(2)}
                                  </td>

                                  <td className="text-start">
                                    {(() => {
                                      switch (product.status) {
                                        case -1:
                                          return (
                                            <span className="badge bg-danger-subtle text-danger p-2">
                                              Rejected
                                            </span>
                                          );
                                        case 0:
                                          return (
                                            <span className="badge bg-warning-subtle text-warning p-2">
                                              Pending
                                            </span>
                                          );
                                        case 1:
                                          return (
                                            <span className="badge bg-success-subtle text-success p-2">
                                              Approved
                                            </span>
                                          );

                                        default:
                                          return null; // Return null if the status is not recognized
                                      }
                                    })()}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                        <div className="border-top border-top-dashed mt-2">
                          <Table
                            className="table-borderless table-nowrap align-middle mb-0 ms-auto"
                            style={{ width: "250px" }}
                          >
                            <tbody>
                              <tr className="border-top border-top-dashed fs-15">
                                <th scope="row">Total Amount</th>
                                <th className="text-end">
                                  ${order.totalAmount.toFixed(2)}
                                </th>
                              </tr>
                            </tbody>
                          </Table>
                        </div>

                        <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                          <button
                            className="btn btn-info"
                            onClick={() => window.print()}
                          >
                            <i className="ri-printer-line align-bottom me-1"></i>{" "}
                            Print
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleDownload}
                          >
                            <i className="ri-download-2-line align-bottom me-1"></i>{" "}
                            Download
                          </button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoiceDetails;
