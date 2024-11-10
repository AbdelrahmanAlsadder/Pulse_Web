import React from 'react';

import { Container } from 'react-bootstrap';
import InvoiceTable from './InvoiceTable';

const Invoice = () => {
  document.title="Invoice ";

  return (
    <React.Fragment>
        <div className="page-content">
            <Container fluid>
                             
                <InvoiceTable/>
            </Container>    
        </div>
    </React.Fragment>
  )
}

export default Invoice
