import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Table, Dropdown } from "react-bootstrap";
import logoDark from "../../../assets/images/logo-dark.png";
import logoLight from "../../../assets/images/logo-light.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const OrderDetails = () => {
  document.title = "Invoice Details ";

  const navigate = useNavigate();

  const { orderId } = useParams();
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();
  const [notPending, setNotPending] = useState<boolean>(true);

  const loadOrder = async (orderId: string) => {
    try {
      setIsLoading(true); // Set loading state to true

      // Fetch the order details from the backend
      const OrderDetails = await firebaseBackend.getOrderById(orderId);
      setOrder(OrderDetails); // Set the order state with fetched order details

      // Recalculate the total amount excluding rejected products (status === -1)
      let totalAmount = 0;
      const updatedProducts = OrderDetails?.products?.map((product: any) => {
        if (product.status !== -1) {
          // Exclude rejected products (status === -1)
          const quantity = product.quantity;
          const price = parseFloat(product.productDetails.price);
          totalAmount += quantity * price; // Accumulate total amount
        }
        return product;
      });

      // Update the order state with the recalculated total amount
      setOrder({
        ...OrderDetails,
        totalAmount: totalAmount, // Set the updated total amount
        products: updatedProducts, // Optionally, update the products array if needed
      });

      // Check if any product has status === 0 (pending)
      if (
        OrderDetails?.products?.some((product: any) => product.status === 0)
      ) {
        setNotPending(false); // Set notPending state accordingly
      }
      await loadUserDetails(OrderDetails.user_id);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false); // Set loading state to false once fetching is complete
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
  const checkOrderStatusOnSave = async (orderId: string) => {
    try {
      if (!orderId) {
        console.error("Order ID is missing or invalid:", orderId);
        toast.error("Invalid order. Please refresh the page and try again.", {
          autoClose: 2000,
        });
        return;
      }

      setIsLoading(true);

      const OrderDetails = await firebaseBackend.getOrderById(orderId);

      if (!OrderDetails) {
        console.error("Order not found for ID:", orderId);
        toast.error("Order not found. Please refresh and try again.", {
          autoClose: 2000,
        });
        return;
      }

      if (
        OrderDetails?.products?.some((product: any) => product.status === 0)
      ) {
        setNotPending(false);
        toast.error("Can't save the order while it has a pending item.", {
          autoClose: 2000,
        });
      } else {
        setNotPending(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      toast.error("Failed to check order status. Please try again.", {
        autoClose: 2000,
      });
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
                              !order.status.some(
                                (item: { uid: any }) =>
                                  item.uid == firebaseBackend.uuid
                              ) ||
                              order.status.find(
                                (i: { uid: any }) =>
                                  i.uid == firebaseBackend.uuid
                              ).status == 0
                            ) {
                              return (
                                <span className="badge bg-warning-subtle text-warning p-2">
                                  Order Placed
                                </span>
                              );
                            }
                            if (
                              order.status.find(
                                (i: { uid: any }) =>
                                  i.uid == firebaseBackend.uuid
                              ).status == 1
                            ) {
                              return (
                                <span className="badge bg-success-subtle text-success p-2">
                                  In Transit
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
                                          return (
                                            <li key={index}>
                                              <Dropdown.Item
                                                onClick={async () => {
                                                  if (
                                                    product.status !==
                                                    item.status
                                                  ) {
                                                    try {
                                                      // Step 1: Update the product status to the new one
                                                      await firebaseBackend.updateOrderItemStatus(
                                                        orderId,
                                                        product.product,
                                                        item.status
                                                      );

                                                      // Step 2: Optionally update the overall order status to 1 (if needed)
                                                      await firebaseBackend.updateOrderStatus(
                                                        orderId,
                                                        1
                                                      );

                                                      // Step 3: Provide feedback to the user
                                                      toast.success(
                                                        "Status Updated Successfully",
                                                        { autoClose: 2000 }
                                                      );

                                                      // Step 4: Reload the order to recalculate the total amount and update the UI
                                                      loadOrder(
                                                        String(orderId)
                                                      ); // Refresh the order data
                                                    } catch (error) {
                                                      // Step 5: Handle errors during the update process
                                                      console.error(
                                                        "Error updating product status:",
                                                        error
                                                      );
                                                      toast.error(
                                                        "Status Update Failed",
                                                        { autoClose: 2000 }
                                                      );
                                                    }
                                                  } else {
                                                    // Step 6: Handle the case where the user tries to set the same status
                                                    toast.error(
                                                      "You cannot change to the same status",
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
                          {showSaveButton && order && (
                            <Link
                              to=""
                              onClick={async (e) => {
                                e.preventDefault();

                                // Check if the orderId exists
                                if (order?.orderId) {
                                  // Call the function to check the order status
                                  await checkOrderStatusOnSave(order.orderId);
                                } else {
                                  console.error("Order ID is missing");
                                  toast.error(
                                    "Invalid order. Please refresh and try again.",
                                    { autoClose: 2000 }
                                  );
                                }
                              }}
                              className="btn btn-primary"
                            >
                              <i className="ri-save-2-line align-bottom me-1"></i>{" "}
                              Save
                            </Link>
                          )}
                          {/* Modal Popup */}
                          <Modal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            centered
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Warning!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              If you press "Save Anyway," you will not be able
                              to edit the order again. You will find it in the
                              invoice details page.
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                              >
                                Close
                              </Button>
                              <Button
                                variant="danger"
                                onClick={async () => {
                                  try {
                                    const final_state = order.products.every(
                                      (product: { status: number }) =>
                                        product.status === -1
                                    );
                                    if (final_state) {
                                      await firebaseBackend.updateOrderStatus(
                                        orderId,
                                        -1
                                      );
                                    } else {
                                      await firebaseBackend.updateOrderStatus(
                                        orderId,
                                        2
                                      );
                                    }
                                    toast.success(
                                      "Status Updated Successfully",
                                      { autoClose: 2000 }
                                    );
                                    // loadOrder(String(orderId));
                                    navigate(-1);

                                    setShowSaveButton(false); // Hide the main Save button
                                  } catch (error) {
                                    toast.error("Status Update Failed", {
                                      autoClose: 2000,
                                    });
                                  } finally {
                                    setShowModal(false);
                                  }
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
