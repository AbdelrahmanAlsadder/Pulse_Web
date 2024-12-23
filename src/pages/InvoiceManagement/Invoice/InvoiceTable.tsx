import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import { DeleteModal } from "../../../Common/DeleteModal";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { Link } from "react-router-dom";
import moment from "moment";

interface paymentProps {
  isShow: any;
  hidePaymentModal: any;
}

const InvoiceTable = ({ isShow, hidePaymentModal }: paymentProps) => {




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



  const [editPayment, setEditPayment] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();



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
        Cell: (cell: any) => (
          <>{moment(cell.row.original.date.toDate()).format("MMMM Do YYYY")}</>
        ),
      },

      {
        Header: "Amount",
        accessor: "totalAmount",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>${cell.row.original.totalAmount.toFixed(2)}</>,
      },
      {
        Header: "Status",
        accessor: "status",
        key: "status",
        Filter: false,
        isSortable: true,
        Cell: (cell) => {
          if (
            cell.row.original.status.find(
              (i: { uid: any }) => i.uid == firebaseBackend.uuid
            ).status == -1
          ) {
            return (
              <span className="badge bg-danger-subtle text-danger p-2">
                Rejected
              </span>
            );
          }
          if (
            cell.row.original.status.find(
              (i: { uid: any }) => i.uid == firebaseBackend.uuid
            ).status == 2
          ) {
            return (
              <span className="badge bg-info-subtle text-info p-2">
                Completed
              </span>
            );
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
                >
                  {" "}
   
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
                      <NoSearchResult
                        title1={"No Invoices Yet!"}
                        title2={
                          "If an order has been saved, it will be fined as an invoice here."
                        }
                      />
                    )}
                  </Card.Body>
                </Card>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>




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
