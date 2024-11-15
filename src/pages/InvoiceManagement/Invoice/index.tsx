import React, {useState} from 'react'
import { Container } from 'react-bootstrap';
import InvoiceTable from './InvoiceTable';

const Invoice = () => {
  document.title="Invoice ";

  const [isShow, setIsShow] = useState(false)

    const hidePaymentModal = () => {
        setIsShow(!isShow);
    };

  return (
    <React.Fragment>
        <div className="page-content">
            <Container fluid>
                             
                <InvoiceTable isShow={isShow} hidePaymentModal={hidePaymentModal}/>
            </Container>    
        </div>
    </React.Fragment>
  )
}

export default Invoice
