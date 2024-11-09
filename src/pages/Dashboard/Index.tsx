import React from "react";
import { Container } from "react-bootstrap";
import PaymentActivity from "./PaymentActivity";
import InvoiceList from "./InvoiceList";

const Dashboard = () => {
  document.title = "Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <PaymentActivity />
          <InvoiceList />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
