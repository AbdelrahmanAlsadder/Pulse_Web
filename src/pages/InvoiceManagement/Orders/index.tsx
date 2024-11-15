import React, {useState} from 'react'

import { Container } from 'react-bootstrap'
import PaymentTable from './OrderTable'

const Orders = () => {
  document.title="Orders ";
  
  const [isShow, setIsShow] = useState(false)

    const hidePaymentModal = () => {
        setIsShow(!isShow);
    };

  return (
    <React.Fragment>
        <div className="page-content">
            <Container fluid>
         
                <PaymentTable isShow={isShow} hidePaymentModal={hidePaymentModal}/>
            </Container>
        </div>    
    </React.Fragment>
  )
}

export default Orders
