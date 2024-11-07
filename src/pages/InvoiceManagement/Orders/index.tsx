import React, {useState} from 'react'
import BreadCrumb from '../../../Common/BreadCrumb'
import { Container } from 'react-bootstrap'
import PaymentTable from './PaymentTable'

const Orders = () => {
  document.title="Orders | Invoika Admin & Dashboard Template";
  
  const [isShow, setIsShow] = useState(false)

    const hidePaymentModal = () => {
        setIsShow(!isShow);
    };

  return (
    <React.Fragment>
        <div className="page-content">
            <Container fluid>
                <BreadCrumb pageTitle="Orders" title="Orders" />
                <PaymentTable isShow={isShow} hidePaymentModal={hidePaymentModal}/>
            </Container>
        </div>    
    </React.Fragment>
  )
}

export default Orders
