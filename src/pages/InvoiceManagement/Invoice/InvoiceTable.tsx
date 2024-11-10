import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Col, Dropdown, Form, Nav, Row, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import {
  getPayments as onGetPayments,
  deletePayment as onDeletePayment,
} from "../../../slices/thunk";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import { DeleteModal } from "../../../Common/DeleteModal";
import { handleSearchData } from "../../../Common/Tabledata/SorttingData";
import EditPayment from "../../../Common/CrudModal/EditPayment";
import Addpayment from "../../../Common/CrudModal/Addpayment";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { Link } from "react-router-dom";
import moment from "moment";

interface paymentProps {
  isShow: any;
  hidePaymentModal: any;
}

const InvoiceTable = ({ isShow, hidePaymentModal }: paymentProps) => {
  const selectPaymentsList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      paymentList: invoices.paymentList,
    })
  );

  const { paymentList } = useSelector(selectPaymentsList);

  const [payments, setPayments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();
  console.log("payments :>> ", payments);
  const loadOrder = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const productsList = await firebaseBackend.getOrderByUID2(item);
      setPayments(productsList);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadOrder();
  }, [firebaseBackend]);

  // Delete modal
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<any>();

  const handleDeleteModal = useCallback(
    (id: any) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleDeleteId = () => {
    // dispatch(onDeletePayment(deletid.id));
    setDelet(false);
  };

  const toggleTab = (type: any) => {
    if (type !== "all") {
      setPayments(
        paymentList.filter((payment: any) => payment.status === type)
      );
    } else {
      setPayments(paymentList);
    }
  };

  const [editPayment, setEditPayment] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();

  const handleCloseEdit = () => setEditPayment(false);
  const handleEditPayment = (item: any) => {
    setEditPayment(true);
    setEdit({
      id: item.id,
      member: item.member,
      date: item.date,
      paymentDetails: item.paymentDetails,
      paymentType: item.paymentType,
      amount: item.amount,
      status: item.status,
    });
  };

  // search
  const handleSearch = async (ele: any) => {
    const item = ele.value.trim(); // Trim whitespace

    loadOrder(item);
  };

  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => any;
  }

  const columns: columnsType[] = useMemo(
    () => [
      {
        Header: "Pharmacy",
        accessor: "member",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.user.username}</>,
      },
      {
        Header: "Date",
        accessor: "date",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{moment(cell.row.original.date.toDate()).format(
          "MMMM Do YYYY"
        )}</>,
        
      },

      {
        Header: "Amount",
        accessor: "totalAmount",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>${cell.row.original.totalAmount}</>,
      },
      {
        Header: "Status",
        accessor: "status",
        key: "status",
        Filter: false,
        isSortable: true,
        Cell: (cell) => {
          switch (cell.row.original.status) {
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
        },
      },
      {
        Header: "Action",
        accessor: "action",
        Filter: false,
        style: { width: "12%" },

        isSortable: false,
        Cell: (cell: any) => (
          <Link
            to={`/invoice-details/${cell.row.original.id}`}
            className="btn btn-soft-secondary btn-sm arrow-none d-inline-flex align-items-center"
          >
            <i className="las la-eye fs-18 align-middle text-muted"></i>
          </Link>
        ),
      },
    ],
    [handleDeleteModal]
  );

  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <Col sm={4}>
          {/* <button
            className="btn btn-primary addPayment-modal"
            onClick={hidePaymentModal}
          >
            <i className="las la-plus me-1"></i> Add Payment
          </button> */}
        </Col>

        {/* <div className="col-sm-auto ms-auto">
          <div className="d-flex gap-3">
            <div className="search-box">
              <Form.Control
                type="text"
                id="searchMemberList"
                placeholder="Search for Result"
                onChange={(e: any) => handleSearch(e.target)}
              />
              <i className="las la-search search-icon"></i>
            </div>
            <Dropdown>
              <Dropdown.Toggle
                as="button"
                className="btn btn-soft-info btn-icon fs-14 arrow-none"
              >
                <i className="las la-ellipsis-v fs-18"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>All</Dropdown.Item>
                <Dropdown.Item>Last Week</Dropdown.Item>
                <Dropdown.Item>Last Month</Dropdown.Item>
                <Dropdown.Item>Last Year</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div> */}
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Tab.Container defaultActiveKey="all">
                <Nav
                  as="ul"
                  variant="tabs"
                  className="nav-tabs nav-tabs-custom nav-success mb-3"
                >   {/* 
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="all"
                      onClick={() => {
                        toggleTab("all");
                      }}
                    >
                      All
                    </Nav.Link>
                  </Nav.Item>
               <Nav.Item as="li">
                    <Nav.Link
                      eventKey="paid"
                      onClick={() => {
                        toggleTab("Paid");
                      }}
                    >
                      Paid
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="pending"
                      onClick={() => {
                        toggleTab("Pending");
                      }}
                    >
                      Pending
                    </Nav.Link>
                  </Nav.Item> */}
                </Nav>

                <Card>
                  <Card.Body>
                    {payments && payments.length > 0 ? (
                      <TableContainer
                        isPagination={true}
                        columns={columns}
                        data={payments || []}
                        customPageSize={9}
                        divClassName="table-card table-responsive"
                        tableClass="table-hover table-nowrap align-middle mb-0"
                        isBordered={false}
                        theadClass="table-light"
                        PaginationClass="align-items-center mt-4 gy-3"
                      />
                    ) : (
                      <NoSearchResult />
                    )}
                  </Card.Body>
                </Card>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Addpayment
        isShow={isShow}
        handleClose={hidePaymentModal}
        handleShow={isShow}
      /> */}

      <EditPayment
        isShow={editPayment}
        handleClose={handleCloseEdit}
        edit={edit}
      />

      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />
    </React.Fragment>
  );
};



export default InvoiceTable;
