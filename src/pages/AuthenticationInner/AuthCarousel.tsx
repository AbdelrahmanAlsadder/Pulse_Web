import React from 'react'
import { Carousel, Col } from 'react-bootstrap'

const AuthCarousel = () => {
  return (
    <React.Fragment>
      <Col lg={6}>
                                                    <div className="d-flex h-100 bg-auth align-items-end">
                                                        <div className="p-lg-5 p-4">
                                                            <div className="bg-overlay bg-primary"></div>
                                                            <div className="p-0 p-sm-4 px-xl-0 py-5">
                                                                <Carousel indicators={true} controls={false}>
                                                                        <Carousel.Item>
                                                                            <div className="testi-contain text-center">
                                                                                <h5 className="fs-20 text-white mb-0">Seamless Drug Distribution
                                                                                </h5>
                                                                                <p className="fs-15 text-white-50 mt-2 mb-0">Empowering pharmacies with streamlined orders directly from trusted warehouses.</p>
                                                                            </div>
                                                                        </Carousel.Item>
                        
                                                                        <Carousel.Item>
                                                                            <div className="testi-contain text-center">
                                                                                <h5 className="fs-20 text-white mb-0">Streamlined Order Process</h5>
                                                                                <p className="fs-15 text-white-50 mt-2 mb-0">Receive and fulfill orders swiftly to enhance customer satisfaction and reduce delays.
                                                                                </p>
                                                                            </div>
                                                                        </Carousel.Item>
                        
                                                                        <Carousel.Item>
                                                                            <div className="testi-contain text-center">
                                                                                <h5 className="fs-20 text-white mb-0">Seamless Integration with Pharmacies</h5>
                                                                                <p className="fs-15 text-white-50 mt-2 mb-0">Connect effortlessly with pharmacies to fulfill orders and manage deliveries. 
                                                                                </p>
                                                                            </div>
                                                                        </Carousel.Item>
                                                                                                                                  
                                                                </Carousel>                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
    </React.Fragment>
  )
}

export default AuthCarousel