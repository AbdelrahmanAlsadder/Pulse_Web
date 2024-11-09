import React, { useState } from 'react';
import Breadcrumb from '../../../../Common/BreadCrumb';
import { Button, Card, Col, Row, Image } from 'react-bootstrap';
import { Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DefaultOffcanvasExample } from './UiOffcanvasCode';

// import Images
import avatar1 from '../../../../assets/images/users/avatar-1.jpg'
import avatar2 from '../../../../assets/images/users/avatar-2.jpg'
import avatar3 from '../../../../assets/images/users/avatar-3.jpg'
import avatar4 from '../../../../assets/images/users/avatar-4.jpg'
import avatar6 from '../../../../assets/images/users/avatar-6.jpg'
import avatar7 from '../../../../assets/images/users/avatar-7.jpg'
import avatar8 from '../../../../assets/images/users/avatar-8.jpg'

import img2 from '../../../../assets/images/small/img-2.jpg'
import img3 from '../../../../assets/images/small/img-3.jpg'
import img4 from '../../../../assets/images/small/img-4.jpg'

const Default = () => {
    document.title=" Offcanvas ";


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <React.Fragment>
            <div className="page">
                <Breadcrumb pageTitle="Bootstrap Ui" title="Offcanvas" />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <h4 className="card-title mb-0">Default Offcanvas</h4>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted">Use the <code>offcanvas</code> class to set a default offcanvas.</p>
                                <div className="hstack flex-wrap gap-2">
                                    <Link className="btn btn-secondary" onClick={handleShow} to="#offcanvasExample">
                                        Link with href
                                    </Link>
                                    <Button variant='secondary' onClick={handleShow}>
                                        Button with data-bs-target
                                    </Button>
                                </div>
                                <Offcanvas show={show} onHide={handleClose}>
                                    <Offcanvas.Header className="border-bottom" closeButton>
                                        <Offcanvas.Title id="offcanvasExampleLabel">Recent Acitivity</Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body className="p-0 overflow-hidden">
                                        <div data-simplebar style={{ height: "calc(100vh - 112px)" }}>
                                            <div className="acitivity-timeline p-4">
                                                <div className="acitivity-item d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar1} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Oliver Phillips <span className="badge bg-soft-primary text-primary align-middle">New</span></h6>
                                                        <p className="text-muted mb-2">We talked about a project on linkedin.</p>
                                                        <small className="mb-0 text-muted">Today</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item py-3 d-flex">
                                                    <div className="flex-shrink-0 avatar-xs acitivity-avatar">
                                                        <div className="avatar-title bg-soft-success text-success rounded-circle">
                                                            N
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Nancy Martino <span className="badge bg-soft-secondary text-secondary align-middle">In Progress</span></h6>
                                                        <p className="text-muted mb-2"><i className="ri-file-text-line align-middle ms-2"></i> Create new project Buildng product</p>
                                                        <div className="avatar-group mb-2">
                                                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Christi">
                                                                <Image src={avatar4} alt="" className="rounded-circle avatar-xs" />
                                                            </Link>
                                                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Frank Hook">
                                                                <Image src={avatar3} alt="" className="rounded-circle avatar-xs" />
                                                            </Link>
                                                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title=" Ruby">
                                                                <div className="avatar-xs">
                                                                    <div className="avatar-title rounded-circle bg-light text-primary">
                                                                        R
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="more">
                                                                <div className="avatar-xs">
                                                                    <div className="avatar-title rounded-circle">
                                                                        2+
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <small className="mb-0 text-muted">Yesterday</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item py-3 d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar2} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Natasha Carey <span className="badge bg-soft-success text-success align-middle">Completed</span></h6>
                                                        <p className="text-muted mb-2">Adding a new event with attachments</p>
                                                        <div className="row border border-dashed gx-2 p-2 mb-2">
                                                            <div className="col-4">
                                                                <Image src={img2} alt="" className="img-fluid rounded" />
                                                            </div>
                                                            <div className="col-4">
                                                                <Image src={img3} alt="" className="img-fluid rounded" />
                                                            </div>
                                                            <div className="col-4">
                                                                <Image src={img4} alt="" className="img-fluid rounded" />
                                                            </div>
                                                        </div>
                                                        <small className="mb-0 text-muted">25 Nov</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item py-3 d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar6} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Bethany Johnson</h6>
                                                        <p className="text-muted mb-2">added a new member to PULSE dashboard</p>
                                                        <small className="mb-0 text-muted">19 Nov</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item py-3 d-flex">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-xs acitivity-avatar">
                                                            <div className="avatar-title rounded-circle bg-soft-danger text-danger">
                                                                <i className="ri-shopping-bag-line"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Your order is placed <span className="badge bg-soft-danger text-danger align-middle ms-1">Out of Delivery</span></h6>
                                                        <p className="text-muted mb-2">These customers can rest assured their order has been placed.</p>
                                                        <small className="mb-0 text-muted">16 Nov</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item py-3 d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar7} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Lewis Pratt</h6>
                                                        <p className="text-muted mb-2">They all have something to say beyond the words on the page. They can come across as casual or neutral, exotic or graphic. </p>
                                                        <small className="mb-0 text-muted">22 Oct</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item py-3 d-flex">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-xs acitivity-avatar">
                                                            <div className="avatar-title rounded-circle bg-soft-info text-info">
                                                                <i className="ri-line-chart-line"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">Monthly sales report</h6>
                                                        <p className="text-muted mb-2"><span className="text-danger">2 days left</span> notification to submit the monthly sales report. <Link to="#" className="link-warning text-decoration-underline">Reports Builder</Link></p>
                                                        <small className="mb-0 text-muted">15 Oct</small>
                                                    </div>
                                                </div>
                                                <div className="acitivity-item d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar8} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-1">New ticket received <span className="badge bg-soft-success text-success align-middle">Completed</span></h6>
                                                        <p className="text-muted mb-2">User <span className="text-secondary">Erica245</span> submitted a ticket.</p>
                                                        <small className="mb-0 text-muted">26 Aug</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Offcanvas.Body>
                                    <div className="offcanvas-foorter border-top p-3 text-center">
                                        <Link to="#" className="link-success">View All Acitivity <i className="ri-arrow-right-s-line align-middle ms-1"></i></Link>
                                    </div>
                                </Offcanvas>
                            </Card.Body>
                            <Card.Body className="bg-light border-bottom border-top bg-opacity-25">
                                <h5 className="fs-12 text-muted mb-0">React Preview</h5>
                            </Card.Body>
                            <Card.Body>
                                <pre className="language-markup" style={{ height: "310px" }}>
                                    <DefaultOffcanvasExample />
                                </pre>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    )
}

export default Default