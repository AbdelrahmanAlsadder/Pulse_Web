import React from 'react'

import { Container } from 'react-bootstrap';
import ProductlistTable from './ProductlistTable';

const ProductList = () => {
    document.title="Product List ";
  return (
    <React.Fragment>
        <div className="page-content">
            <Container fluid>
            
                <ProductlistTable/>
            </Container>
        </div>            
      
    </React.Fragment>
  )
}

export default ProductList
