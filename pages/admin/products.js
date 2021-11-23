import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav, Spinner, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../../utils/error';
import Link from 'next/link'
import Layout from '../../components/Layout';
import Loading from '../../components/Loading'
import { getProducts, createProduct, deleteProduct } from '../../store/product-slice';
import toast, { Toaster } from 'react-hot-toast';

function AdminProducts() {
    const [loading, setLoading] = useState(false)
    const [productID, setProductID] = useState('')
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
    const products = useSelector((state) => state.product.products);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const dispatch = useDispatch()
    const isActive = (r) => {
        if (r === router.pathname) {
            return "text-info fs-5 active"
        } else {
            return ""
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (!userInfo) {
            return router.push('/login');
        }
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/admin/products`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(getProducts(data))
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }, []);
    // useEffect(() => {
    //     async function fetchData() {
    //         const { data } = await axios.get(`/api/admin/products`, {
    //             headers: { authorization: `Bearer ${userInfo.token}` },
    //         });
    //     }
    //     fetchData()
    // }, [])
    const createHandler = async () => {
        setShowCreate(false)
        try {
            setLoading(true)
            const { data } = await axios.post(`/api/admin/products`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
            toast.success("Product created successfully")
            dispatch(createProduct(data))
            router.push(`/admin/product/${data.product._id}`)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }
    const deleteHandler = async (productId) => {
        setShowDelete(false)
        try {
            setLoading(true)
            await axios.delete(`/api/admin/products/${productId}`,
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
            toast.success("Product deleted successfully")
            dispatch(deleteProduct(productId))
            setLoading(false)

        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }
    const handleClose = () => {
        setShowCreate(false)
        setShowDelete(false)
    }
    const handleShowCreate = () => setShowCreate(true);
    const handleShowDelete = (product) => {
        setProductID(product)
        setShowDelete(true);
    }

    return (
        <Layout title="Admin Products">
            <Toaster
                toastOptions={{
                    success: {
                        iconTheme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            <Modal show={showCreate} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to create product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={createHandler}>
                        Yes
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => deleteHandler(productID)}>
                        Yes
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
            {loading ? <Loading /> :
                <Container fluid>
                    <Row className="d-flex justify-content-center py-3">
                        <Col className="col-2">
                            <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                <Nav className="d-flex flex-column justify-content-start fs-6">
                                    <Nav.Item className="ms-2"><Link href="/admin/dashboard" passHref><Nav.Link className={isActive("/admin/dashboard")}>Admin Dashboard</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/admin/orders" passHref><Nav.Link className={isActive("/admin/orders")}>Orders</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/admin/products" passHref><Nav.Link className={isActive("/admin/products")}>Products</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/admin/users" passHref><Nav.Link className={isActive("/admin/users")}>Users</Nav.Link></Link></Nav.Item>
                                </Nav>
                            </Card>
                        </Col>
                        <Col className="col-10">
                            <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                <Card.Body className="d-flex flex-column align-items-start">
                                    <Container fluid className="d-flex justify-content-between mb-2">
                                        <Card.Title className={`${darkStyleText} mt-2`}>Products</Card.Title>
                                        <Button className="bg-warning border-0 w-25 text-black mb-2" onClick={handleShowCreate}>Create</Button>
                                    </Container>
                                    <Table striped bordered hover>
                                        <thead className="text-center">
                                            <tr className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                <th width={'10%'}>Id</th>
                                                <th width={'15%'}>Name</th>
                                                <th width={'15%'}>Price</th>
                                                <th width={'10%'}>Category</th>
                                                <th width={'10%'}>Count</th>
                                                <th width={'15%'}>Rating</th>
                                                <th width={'15%'}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center align-middle">
                                            {products.map(product => {
                                                return (
                                                    <tr key={product._id} className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                        <td>{product._id.substring(19, 24)}</td>
                                                        <td>{product.name}</td>
                                                        <td>${product.price}</td>
                                                        <td>{product.category}</td>
                                                        <td>{product.countInStock}</td>
                                                        <td>{product.rating}</td>
                                                        <td>
                                                            <Button size="sm" className="bg-info border-0" onClick={() => router.push(`/admin/product/${product._id}`)}>Edit</Button>{' '}
                                                            <Button size="sm" className="bg-danger border-0" onClick={() => handleShowDelete(product._id)}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });