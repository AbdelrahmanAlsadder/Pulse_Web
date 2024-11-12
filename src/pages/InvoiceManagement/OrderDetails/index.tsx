import React, { useEffect, useState } from "react";

import { Card, Container, Row, Col, Table, Dropdown } from "react-bootstrap";
import logoDark from "../../../assets/images/logo-dark.png";
import logoLight from "../../../assets/images/logo-light.png";
import { Link, useParams } from "react-router-dom";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';


const OrderDetails = () => {
  document.title = "Invoice Details ";
  const { orderId } = useParams();
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();
  console.log("order :>> ", order);

  const loadOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const OrderDetails = await firebaseBackend.getOrderById(orderId);
      setOrder(OrderDetails);
    } catch (error) {
      console.error("Error fetching order:", error);
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
                            switch (order.status) {
                              case -1:
                                return (
                                  <span className="badge bg-danger-subtle text-danger p-2">
                                    Rejected
                                  </span>
                                );
                              case 0:
                                return (
                                  <span className="badge bg-warning-subtle text-warning p-2">
                                    Order Placed
                                  </span>
                                );
                              case 1:
                                return (
                                  <span className="badge bg-success-subtle text-success p-2">
                                    In Transit
                                  </span>
                                );
                              case 2:
                                return (
                                  <span className="badge bg-info-subtle text-info p-2">
                                    Completed
                                  </span>
                                );
                              default:
                                return null; // Return null if the status is not recognized
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
                            height="17"
                          />
                          <img
                            src={logoLight}
                            className="card-logo card-logo-light"
                            alt="logo light"
                            height="17"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row className="p-4 border-top border-top-dashed">
                    <Col lg={9}>
                      <Row className="g-3">
                        <div className="col-6">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">
                            Warehouse Address
                          </h6>
                          {/* <p className="fw-medium mb-2">
                            {order.billingAddress.name}
                          </p>
                          <p className="text-muted mb-1">
                            {order.billingAddress.line1}
                          </p>
                          <p className="text-muted mb-1">
                            <span>Phone: </span>
                            <span>{order.billingAddress.phone}</span>
                          </p>
                          <p className="text-muted mb-0">
                            <span>Tax: </span>
                            <span>{order.billingAddress.tax}</span>
                          </p> */}
                        </div>

                        <div className="col-6">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">
                            Shipping Address
                          </h6>
                          {/* <p className="fw-medium mb-2">
                            {order.shippingAddress.name}
                          </p>
                          <p className="text-muted mb-1">
                            {order.shippingAddress.line1}
                          </p>
                          <p className="text-muted mb-1">
                            <span>Phone: </span>
                            <span>{order.shippingAddress.phone}</span>
                          </p> */}
                        </div>
                      </Row>
                    </Col>
                    <Col lg={3}></Col>
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
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        disabled={order.status == 2}
                                        as="button"
                                        className="btn btn-sm border-0 arrow-none"
                                      >
                                        {(() => {
                                          switch (product.status) {
                                            case -1:
                                              return (
                                                <span className="badge bg-danger-subtle text-danger p-2">
                                                  Rejected
                                                  <i className="las la-chevron-down align-middle ms-2 text-black"></i>
                                                  ;
                                                </span>
                                              );
                                            case 0:
                                              return (
                                                <span className="badge bg-warning-subtle text-warning p-2">
                                                  Pending
                                                  <i className="las la-chevron-down align-middle ms-2 text-black"></i>
                                                  ;
                                                </span>
                                              );
                                            case 1:
                                              return (
                                                <span className="badge bg-success-subtle text-success p-2">
                                                  Approved
                                                  <i className="las la-chevron-down align-middle ms-2 text-black"></i>
                                                </span>
                                              );

                                            default:
                                              return null; // Return null if the status is not recognized
                                          }
                                        })()}
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="dropdown-menu-end">
                                        {[
                                          {
                                            name: "Pending",
                                            status: 0,
                                            icon: "las la-clock text-warning",
                                          },
                                          {
                                            name: "Rejected",
                                            status: -1,
                                            icon: "las la-times-circle text-danger",
                                          },
                                          {
                                            name: "Approved",
                                            status: 1,
                                            icon: "las la-check-circle text-success",
                                          },
                                        ].map((item, index) => {
                                          console.log(
                                            "product.id :>> ",
                                            product
                                          );
                                          return (
                                            <li key={index}>
                                              <Dropdown.Item
                                                onClick={async () => {
                                                  if (
                                                    product.status !=
                                                    item.status
                                                  ) {
                                                    try {
                                                      await firebaseBackend.updateOrderItemStatus(
                                                        orderId,
                                                        product.product,
                                                        item.status
                                                      );
                                                      await firebaseBackend.updateOrderStatus(
                                                        orderId,
                                                        1
                                                      );
                                                      toast.success(
                                                        "Status Updated Successfully",
                                                        { autoClose: 2000 }
                                                      );
                                                      loadOrder(
                                                        String(orderId)
                                                      );
                                                    } catch (error) {
                                                      toast.error(
                                                        "Status Updated Failed",
                                                        { autoClose: 2000 }
                                                      );
                                                    }
                                                  } else {
                                                    toast.error(
                                                      "You cannot change same status",
                                                      { autoClose: 2000 }
                                                    );
                                                  }
                                                }}
                                              >
                                                <i
                                                  className={`${item.icon} fs-18 align-middle me-2 text-muted`}
                                                ></i>
                                                {item.name}
                                              </Dropdown.Item>
                                            </li>
                                          );
                                        })}
                                      </Dropdown.Menu>
                                    </Dropdown>
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
  {showSaveButton && (
    <Link
      to=""
      onClick={(e) => {
        e.preventDefault();
        setShowModal(true);
      }}
      className="btn btn-primary"
    >
      <i className="ri-save-2-line align-bottom me-1"></i> Save
    </Link>
  )}

  {/* Modal Popup */}
  <Modal show={showModal} onHide={() => setShowModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Warning!</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      If you press "Save Anyway," you will not be able to edit the order again.
      You will find it in the invoice details page.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Close
      </Button>
      <Button
        variant="danger"
        onClick={async () => {
          try {
            await firebaseBackend.updateOrderStatus(orderId, 2);
            toast.success("Status Updated Successfully", { autoClose: 2000 });
            loadOrder(String(orderId));
            setShowSaveButton(false); // Hide the main Save button
          } catch (error) {
            toast.error("Status Update Failed", { autoClose: 2000 });
          }
          setShowModal(false);
        }}
      >
        Save Anyway
      </Button>
    </Modal.Footer>
  </Modal>
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

export default OrderDetails;
