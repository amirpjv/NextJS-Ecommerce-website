import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState, Fragment } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav, Spinner, Form, InputGroup } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../../../utils/error';
import Link from 'next/link'
import Layout from '../../../components/Layout';
import Loading from '../../../components/Loading'
import { getProduct } from '../../../store/product-slice';
import toast, { Toaster } from 'react-hot-toast';

function ProductEdit({ params }) {
    const [isFeatured, setIsFeatured] = useState(false)
    const [loading, setLoading] = useState(false)
    const [upload, setUpload] = useState(false)
    const [values, setValues] = useState({
        name: '',
        slug: '',
        price: 0,
        description: '',
        brand: '',
        countInStock: 0,
        category: '',
        image: '',
        featuredImage: ''
    })
    const productId = params.id
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
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
            const { data } = await axios.get(`/api/admin/products/${productId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(getProduct(data))
            setValues({
                name: data.name,
                slug: data.slug,
                description: data.description,
                category: data.category,
                brand: data.brand,
                countInStock: data.countInStock,
                price: data.price,
                image: data.image,
                featuredImage: data.featuredImage,
            })
            setIsFeatured(data.isFeatured)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault()
        toast.dismiss()
        try {
            await axios.put(`/api/admin/products/${productId}`, {
                name: values.name,
                slug: values.slug,
                description: values.description,
                category: values.category,
                brand: values.brand,
                countInStock: values.countInStock,
                price: values.price,
                image: values.image,
                featuredImage: values.featuredImage,
                isFeatured: isFeatured,
            },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
            toast.success("Product updated successfully.")
            router.push('/admin/products')
        } catch (err) {
            toast.error(err)
        }
    }
    const changeHandler = (e) => {
        if (e.target.type === "checkbox") {
            setIsFeatured(!isFeatured)
        }
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    const uploadImageHandler = async (e) => {
        const file = e.target.files[0]
        const bodyFormData = new FormData()
        bodyFormData.append('file', file)
        try {
            setUpload(true)
            const { data } = await axios.post(`/api/admin/upload`, bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`
                },
            });
            setValues({ ...values, image: data.secure_url })
            setUpload(false)
            toast.success('File uploaded Successfully')
        } catch (err) {
            setUpload(false)
            toast.error(err)
        }
    }
    const uploadFeaturedImageHandler = async (e) => {
        const file = e.target.files[0]
        const bodyFormData = new FormData()
        bodyFormData.append('file', file)
        try {
            setUpload(true)
            const { data } = await axios.post(`/api/admin/upload`, bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`
                },
            });
            setValues({ ...values, featuredImage: data.secure_url })
            setUpload(false)
            toast.success('File uploaded Successfully')
        } catch (err) {
            setUpload(false)
            toast.error(err)
        }
    }
    return (
        <Layout title="Edit Product">
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
                                    <Card.Title className={`${darkStyleText} pt-2 ps-3 pb-2`}>Edit Product {`${productId}`}</Card.Title>
                                    <Form className={`${darkStyleText} w-100`} onSubmit={submitHandler}>
                                        <Form.Group className="mb-2" controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter name"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="slug">
                                            <Form.Label>Slug</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter slug"
                                                    name="slug"
                                                    value={values.slug}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="price">
                                            <Form.Label>Price</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter price"
                                                    name="price"
                                                    value={values.price}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        {upload
                                            ?
                                            <Spinner animation="border" variant="primary" className="d-flex" />
                                            :
                                            <Card className="bg-secondary p-2 mb-2 mt-3">
                                                <Form.Group className="mb-3" controlId="image">
                                                    <Form.Label>Image</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            // type="image"
                                                            // placeholder="Upload image"
                                                            name="image"
                                                            value={values.image}
                                                            onChange={changeHandler}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                                <input id="inputUpload" type="file" onChange={uploadImageHandler} accept="image/png, image/gif, image/jpeg, image/jpg" className="mb-2" />
                                            </Card>
                                        }
                                        <Form.Group className="mb-3" controlId="checkbox">
                                            <Form.Check type="checkbox" label="Is Featured" checked={isFeatured ? true : false} onChange={changeHandler} />
                                        </Form.Group>
                                        {upload
                                            ?
                                            <Spinner animation="border" variant="primary" className="d-flex" />
                                            :
                                            <Card className="bg-secondary p-2 mb-2 mt-3">
                                                <Form.Group className="mb-3" controlId="featuredImage">
                                                    <Form.Label>Featured Image</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            // type="image"
                                                            // placeholder="Upload image"
                                                            name="featuredImage"
                                                            value={values.featuredImage}
                                                            onChange={changeHandler}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                                <input id="inputFeaturedImageUpload" type="file" onChange={uploadFeaturedImageHandler} accept="image/png, image/gif, image/jpeg, image/jpg" className="mb-2" />
                                            </Card>
                                        }
                                        <Form.Group className="mb-3" controlId="category">
                                            <Form.Label>Category</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter category"
                                                    name="category"
                                                    value={values.category}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="brand">
                                            <Form.Label>Brand</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter brand"
                                                    name="brand"
                                                    value={values.brand}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="countInStock">
                                            <Form.Label>Count in stock</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter count in stock"
                                                    name="countInStock"
                                                    value={values.countInStock}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="description">
                                            <Form.Label>Description</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter description"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Button variant="warning" type="submit" className="w-100 mb-3">
                                            Update
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>}
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return { props: { params } }
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });