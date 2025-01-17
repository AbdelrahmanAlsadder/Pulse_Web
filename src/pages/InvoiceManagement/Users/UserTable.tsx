import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import EditUsers from "../../../Common/CrudModal/EditUsers";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import moment from "moment";
import "firebase/storage";

interface userProps {
  isShow: any;
  hideUserModal: any;
}

const UserTable = ({ isShow, hideUserModal }: userProps) => {
 

  const selectUsersList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      usersList: invoices.usersList,
    })
  );
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
 
  const firebaseBackend = getFirebaseBackend();



  const handleOpenFile = (item: any) => {
    const commercialRegisterUrl = item.commercial_register; // Get the URL from the user data
  
    if (commercialRegisterUrl) {
      // Open the PDF in a new tab
      window.open(commercialRegisterUrl, "_blank");
    } else {
      // Handle the case where no commercial register URL is found
      alert("Commercial Register not available.");
    }
  };
  const loadUsers = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const usersList = await firebaseBackend.fetchUsers(item);
      setUsers(usersList);
    } catch (error) {
      console.error("Error loading userss:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
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

  // // search

  // search
  const handleSearch = async (ele: any) => {
    const item = ele.value.trim(); // Trim whitespace

    loadUsers(item);
  };

  const [editUser, setEditUser] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();

  const handleCloseEdit = (reset: boolean) => {
    if (reset) loadUsers();
    setEditUser(false);
  };
  const handleEditUser = (item: any) => {
    setEditUser(true);
    setEdit(item);
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
        Header: "MEMBER NAME",
        accessor: "memberName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.username}</>,
      },
      {
        Header: "EMAIL",
        accessor: "email",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.email}</>,
      },
      {
        Header: "MOBILE",
        accessor: "mobile",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.phone}</>,
      },
      {
        Header: "REQUEST SENT ON",
        accessor: "registeredOn",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>
            {moment(cell.row.original.createdDtm.toDate()).format(
              "MMMM Do YYYY"
            )}
          </>
        ),
      },
      {
        Header: "STATUS",
        accessor: "status",
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
                  Pending
                </span>
              );
            case 1:
              return (
                <span className="badge bg-success-subtle text-success p-2">
                  Admin
                </span>
              );
            case 2:
              return (
                <span className="badge bg-info-subtle text-primary p-2">
                  Warehouse
                </span>
              );
            case 3:
              return (
                <span className="badge bg-info-subtle text-info p-2">
                  Pharmacy
                </span>
              );
            default:
              return null; // Return null if the status is not recognized
          }
        },
      },
      {
        Header: "ACTION",
        accessor: "action",
        Filter: false,
        style: { width: "12%" },

        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEditUser(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                <i className="las la-pen fs-17 align-middle"></i>
              </Link>
            </li>
            <li
              className="list-inline-item"
              onClick={() => {
                const item = cell.row.original;
                handleDeleteModal(item);
              }}
            >
              <Link
                to="#"
                className="btn btn-soft-danger btn-sm d-inline-block"
                onClick={() => handleOpenFile(cell.row.original)}
                
                title="Open Commercial Register"
              >
                <i className="las la-file-download fs-17 align-middle"></i>
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    [handleDeleteModal]
  );

  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <div className="col-sm-auto ms-auto">
          <div className="d-flex gap-3">
            <div className="search-box">
              <Form.Control
                type="text"
                id="searchMemberList"
                placeholder="Search by Member Name"
                onChange={(e: any) => handleSearch(e.target)}
              />
              <i className="las la-search search-icon"></i>
            </div>
          </div>
        </div>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              {users && users.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={users || []}
                  customPageSize={9}
                  divClassName="table-card table-responsive"
                  tableClass="table-hover table-nowrap align-middle mb-0"
                  isBordered={false}
                  PaginationClass="align-items-center mt-4 gy-3"
                />
              ) : (
                <NoSearchResult />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

  

      <EditUsers isShow={editUser} handleClose={handleCloseEdit} edit={edit} />
      <ToastContainer />
    </React.Fragment>
  );
};

export default UserTable;
