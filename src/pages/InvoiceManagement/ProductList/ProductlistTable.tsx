import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Col, Dropdown, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import TableContainer from "../../../Common/Tabledata/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductList as onGetProductList,
  deleteProductList as onDeleteProductList,
} from "../../../slices/thunk";
import { createSelector } from "reselect";
import NoSearchResult from "../../../Common/Tabledata/NoSearchResult";
import { DeleteModal } from "../../../Common/DeleteModal";
import EditProductList from "../../../Common/CrudModal/EditProductList";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductlistTable = () => {
  const dispatch = useDispatch();

  const selectProductList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      productList: invoices.productList,
    })
  );

  // const { productList } = useSelector(selectProductList);

  const [products, setProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firebaseBackend = getFirebaseBackend();

  // useEffect(() => {
  //   dispatch(onGetProductList());
  // }, [dispatch]);

  // useEffect(() => {
  //   setProducts(productList);
  // }, [productList]);

  const loadProducts = async (item?: undefined) => {
    try {
      setIsLoading(true);
      const productsList = await firebaseBackend.fetchProducts(item);
      setProducts(productsList);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadProducts();
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

  const handleDeleteId = async () => {
    await firebaseBackend.deleteProductById(deletid.id);
    toast.success("Product Deleted Successfully", { autoClose: 2000 });
    loadProducts();
    setDelet(false);
  };

  // search
  const handleSearch = async (ele: any) => {
    const item = ele.value.trim(); // Trim whitespace

    loadProducts(item);
  };

  // edit data

  const [editProduct, setEditProduct] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();

  const handleCloseEdit = (reset: boolean) => {
    if (reset) loadProducts();
    setEditProduct(false);
  };
  const handleEditProduct = (item: any) => {
    setEditProduct(true);
    setEdit(item);
  };

  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => JSX.Element;
  }

  const columns: columnsType[] = useMemo(
    () => [
      // {
      //   Header: () => (
      //     <Form>
      //       <Form.Check type="checkbox" />
      //     </Form>
      //   ),
      //   accessor: "id",
      //   key: "id",
      //   Filter: false,
      //   isSortable: false,
      //   width: 50,
      //   Cell: () => (
      //     <Form>
      //       <Form.Check type="checkbox" />
      //     </Form>
      //   ),
      // },
      {
        Header: "PRODUCT NAME",
        accessor: "productName",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const { images, title } = cell.row.original;  // Destructure to get images and title
          
          // Log the product data before rendering
          console.log("Product data:", cell.row.original);  // Log entire product data
          console.log("Images field:", images);  // Log the image URL or empty string
          console.log("Title field:", title);  // Log the product title
      
          // Check if images exist and is a non-empty string
          const renderImage = () => {
            if (images && images.length > 0) {
              // Log the image URL being used
              console.log("Rendering image from URL:", images);
              return <img src={images} alt="Product Image" className="avatar-xs" style={{ objectFit: "cover" }} />;
            } else {
              // If no image, log that there's no image available
              console.log("No image available for product:", title);
              return <span>No Image</span>;
            }
          };
      
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3 avatar-sm">
                <div className="avatar-title bg-light rounded">
                  {renderImage()}  {/* Render image or placeholder */}
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="fs-16 mb-1">{title}</h6>
              </div>
            </div>
          );
        },
      }
      
      
      ,
      {
        Header: "CATEGORY",
        accessor: "category",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.category}</>,
      },
      // {
      //   Header: "IN STOCK",
      //   accessor: "inStock",
      //   Filter: false,
      //   isSortable: true,
      // },
      {
        Header: "Quantity",
        accessor: "quantity",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.quantity}</>,
      },

      {
        Header: "PRICE",
        accessor: "price",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>${cell.row.original.price}</>,
      },
      {
        Header: "Exp Date",
        accessor: "expiryDate",
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.expiryDate}</>,
      },

      {
        Header: "Action",
        accessor: "action",
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => (
          <Dropdown>
            <Dropdown.Toggle
              as="button"
              className="btn btn-soft-secondary btn-sm arrow-none"
            >
              <i className="las la-ellipsis-h align-middle fs-18"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              {/* <li>
                <Dropdown.Item>
                  <i className="las la-eye fs-18 align-middle me-2 text-muted"></i>
                  View
                </Dropdown.Item>
              </li> */}
              <li>
                <Dropdown.Item
                  onClick={() => {
                    const item = cell.row.original;
                    handleEditProduct(item);
                  }}
                >
                  <i className="las la-pen fs-18 align-middle me-2 text-muted"></i>
                  Edit
                </Dropdown.Item>
              </li>
              <li className="dropdown-divider"></li>
              <li>
                <Dropdown.Item
                  className="remove-item-btn"
                  onClick={() => {
                    const item = cell.row.original;
                    handleDeleteModal(item);
                  }}
                >
                  <i className="las la-trash-alt fs-18 align-middle me-2 text-muted"></i>
                  Delete
                </Dropdown.Item>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    [handleDeleteModal]
  );
  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <Col sm={4}>
          <Link to="/product-add" className="btn btn-primary addtax-modal">
            <i className="las la-plus me-1"></i> Add Product
          </Link>
        </Col>

        <div className="col-sm-auto ms-auto">
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
            {/* <Dropdown>
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
            </Dropdown> */}
          </div>
        </div>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body className="table-responsive">
              {isLoading ? (
                <Spinner animation="grow" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : products && products.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={products || []}
                  customPageSize={8}
                  divClassName="table-card "
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

      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />

      <EditProductList
        isShow={editProduct}
        handleClose={handleCloseEdit}
        edit={edit}
      />
    </React.Fragment>
  );
};

export default ProductlistTable;
