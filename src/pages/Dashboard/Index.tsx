import React, {useState} from 'react'
import { Container } from "react-bootstrap";
import PaymentActivity from "./PaymentActivity";
import InvoiceList from "./InvoiceList";

const Dashboard = () => {
  document.title = "Dashboard";
  const [isShow, setIsShow] = useState(false)

  const hidePaymentModal = () => {
      setIsShow(!isShow);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <PaymentActivity />
          <InvoiceList isShow={isShow} hidePaymentModal={hidePaymentModal} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
