//used to display the pagination(the page numbers if the items exceeded a certain numbers)
//this pagination code is widely used in other websites

import React, { useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import NoSearchResult from './Tabledata/NoSearchResult';

// Define the types of the props expected by the Pagination component
interface PaginationProps {
  data?: any; // The full set of data to paginate
  perPageData?: any; // Number of items to show per page
  currentPage?: any; // The current active page
  setCurrentPage?: any; // Function to update the current page
  currentData?: any; // The data displayed on the current page
  className?: any; // Custom class name for styling
}

// Pagination component definition
const Pagination = ({ perPageData, data, currentPage, setCurrentPage, currentData, className }: PaginationProps) => {

  // Boolean to control pagination rendering
  const pagination: boolean = true;

  // Handle click on page numbers
  const handleClick = (e: any) => {
    setCurrentPage(Number(e.target.id)); // Update the current page on click
  };

  // Generate page numbers based on total data and items per page
  const pageNumbers: any = [];
  for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
    pageNumbers.push(i); // Add page numbers
  }

  // Handle previous page click
  const handleprevPage = () => {
    let prevPage = currentPage - 1; // Go to the previous page
    setCurrentPage(prevPage); // Update the page
  };

  // Handle next page click
  const handlenextPage = (event: any) => {
    event.preventDefault(); // Prevent default link behavior
    let nextPage = currentPage + 1; // Go to the next page
    setCurrentPage(nextPage); // Update the page
  };

  // Adjust the current page if it exceeds the total number of pages
  useEffect(() => {
    if (pageNumbers.length && pageNumbers.length < currentPage) {
      setCurrentPage(pageNumbers.length); // Set current page to the last page if out of bounds
    }
  }, [pageNumbers.length, currentPage, setCurrentPage]);

  return (
    <React.Fragment>
      {/* Display a message if there is no data to display */}
      {!currentData?.length && <NoSearchResult />}

      {/* Render pagination controls */}
      {pagination &&
        <Row className={className} id="pagination-element" style={{ display: "flex" }}>
          {/* Display information about the number of results */}
          <div className="col-sm">
            <div className="text-muted text-center text-sm-start">
              Showing <span className="fw-semibold">{perPageData}</span> of <span className="fw-semibold">{data?.length}</span> Results
            </div>
          </div>

          {/* Pagination controls (previous/next page buttons) */}
          <div className="col-sm-auto mt-3 mt-sm-0">
            <div className="pagination-wrap hstack justify-content-center gap-2">
              {/* Render previous button */}
              {currentPage <= 1 ? (
                <Link className="page-item pagination-prev disabled" to="#!">
                  Previous
                </Link>
              ) : (
                <Link className={`${currentPage <= 1 ? "page-item pagination-prev disabled" : "page-item pagination-prev"} `} to="#!" onClick={() => handleprevPage()}>
                  Previous
                </Link>
              )}

              {/* Render page number links */}
              <ul className="pagination listjs-pagination mb-0">
                {(pageNumbers || []).map((item: any, index: any) => (
                  <li className={currentPage === item ? "active " : ""} key={index}>
                    <Link className="page" to="#!" id={item} onClick={(e) => handleClick(e)}>
                      {item} {/* Display the page number */}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Render next button */}
              {currentPage >= pageNumbers.length ? (
                <Link className="page-item pagination-next disabled" to="#!">
                  Next
                </Link>
              ) : (
                <Link className={`${currentPage <= 1 ? "page-item pagination-next disabled" : "page-item pagination-next"} `} to="#!" onClick={(e: any) => handlenextPage(e)}>
                  Next
                </Link>
              )}
            </div>
          </div>
        </Row>}
    </React.Fragment>
  )
}

export default Pagination;
