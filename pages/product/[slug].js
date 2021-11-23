import React, { Fragment, useEffect, useState } from 'react'
import { Container, Button, Row, Col, ListGroup, Form, Spinner, Card, FloatingLabel } from 'react-bootstrap'
import Layout from '../../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Product from '../../models/Product'
import db from '../../utils/db'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { addCartItem } from '../../store/cart-slice';
import { Star, StarFill, StarHalf } from 'react-bootstrap-icons';
import toast, { Toaster } from 'react-hot-toast';

const ProductScreen = ({ product }) => {
    const [loading, setLoading] = useState(false)
    const [reviews, setReviews] = useState([])
    const [comment, setComment] = useState([])
    const [rating, setRating] = useState([])
    const [stars, setStars] = useState({ star1: false, star2: false, star3: false, star4: false, star5: false })
    const router = useRouter()
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const darkStyleBackground = `${darkMode ? 'bg-secondary' : 'bg-white'}`
    if (!product) {
        return (
            < Fragment >
                <Container fluid className="text-center bg-danger p-5"> Product Not Found!</Container>
            </Fragment >
        )
    }
    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/products/${product._id}/reviews`)
            setReviews(data)
        } catch (err) {
            toast.error(err)
        }
    }
    const addToCartHandler = async () => {
        toast.dismiss()
        const { data } = await axios.get(`/api/products/${product._id}`)
        if (data.countInStock <= 0) {
            toast.error('Sorry. Product is out of stock.')
            return
        }
        dispatch(addCartItem({ data }))
        router.push('/cart')
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        toast.dismiss()
        setLoading(true)
        try {
            await axios.post(`/api/products/${product._id}/reviews`, {
                rating,
                comment
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            setLoading(false)
            toast.success('Review submitted successfully')
            fetchReviews()
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }
    const clickStarHandler = (e) => {
        e.preventDefault()
        switch (e.target.id) {
            case 'star1':
                setRating(1)
                setStars({ star1: true, star2: false, star3: false, star4: false, star5: false })
                break;
            case 'star2':
                setRating(2)
                setStars({ star1: true, star2: true, star3: false, star4: false, star5: false })
                break;
            case 'star3':
                setRating(3)
                setStars({ star1: true, star2: true, star3: true, star4: false, star5: false })
                break;
            case 'star4':
                setRating(4)
                setStars({ star1: true, star2: true, star3: true, star4: true, star5: false })
                break;
            case 'star5':
                setRating(5)
                setStars({ star1: true, star2: true, star3: true, star4: true, star5: true })
                break;
            default:
                setStars({ star1: false, star2: false, star3: false, star4: false, star5: false })
        }
    }
    useEffect(() => {
        fetchReviews()
    }, [])
    return (
        <Layout title={product.name} description={product.description}>
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
            <Container fluid className="my-auto d-flex flex-column" style={{ minHeight: `80vh` }}>
                <Container fluid className="my-2">
                    <Link href="/" passHref>
                        <Button variant="outline-warning">Back 2 Products</Button>
                    </Link>
                </Container>
                <Container fluid className="my-auto">
                    <Row className="d-flex justify-content-around ">
                        <Col lg={4} md={7} sm={7} xs={10}>
                            <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive" />
                        </Col>
                        <Col lg={3} md={5} sm={5} xs={10}>
                            <ListGroup className={`lead`}>
                                <h1 className={`${darkStyleText} border-0 lead display-6`}>{product.name}</h1>
                                {/* <ListGroup.Item className="border-0">{product.name}</ListGroup.Item> */}
                                <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0 rounded-top`}>Category: {product.category}</ListGroup.Item>
                                <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>Brand: {product.brand}</ListGroup.Item>
                                {product.rating === 0 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating < 1 && product.rating > 0 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating === 1 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating < 2 && product.rating > 1 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating === 2 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating < 3 && product.rating > 2 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating === 3 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating < 4 && product.rating > 3 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating === 4 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating < 5 && product.rating > 4 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                {product.rating === 5 &&
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                        <Link href="/review"><a className="text-decoration-none"><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" />({product.numReviews} reviews)</a></Link>
                                    </ListGroup.Item>
                                }
                                <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0 rounded-bottom`}>Description: {product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col lg={3} md={6} sm={6} xs={10} className="m-3">
                            <ListGroup className="fw-bold text-center">
                                <ListGroup.Item className={`${darkStyleBackground} ${darkStyleText} border-bottom-0`}>
                                    <Container className="d-flex justify-content-around">
                                        <Container >Price</Container>
                                        <Container>${product.price}</Container>
                                    </Container>
                                </ListGroup.Item>
                                <ListGroup.Item className={`${darkStyleBackground} ${darkStyleText} border-bottom-0`}>
                                    <Container className="d-flex justify-content-around align-content-center align-items-center">
                                        <Container>Status</Container>
                                        <Container>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</Container>
                                    </Container>
                                </ListGroup.Item>
                                <ListGroup.Item className={`${darkStyleBackground} border-bottom-0`}>
                                    <Button className="btn w-100 btn-warning mb-2" onClick={addToCartHandler}>ADD TO CART</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </Container>
            {loading ? <Spinner animation="border" variant="warning" className="d-flex mx-auto" /> :
                <Card className="p-4 mb-3">
                    <h3 className={`${darkStyleText}d-flex justify-content-start align-content-start align-items-start`}>Customer Reviews</h3>
                    <h6>{reviews.length === 0 && 'No review'}</h6>
                    {reviews.map((review) => (
                        <Container key={review._id}>
                            <Container>
                                <Row className="row mb-2">
                                    <Col className="d-flex flex-column col-2">
                                        <strong className="mt-2">{review.name}</strong>
                                        <p className="mt-2">{review.createdAt.substring(0, 10)}</p>
                                    </Col>
                                    <Col className="d-flex flex-column col-2 align-items-start justify-items-start border-2 border-start">
                                        {review.rating === 0 &&
                                            <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                                <Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />
                                            </ListGroup.Item>
                                        }
                                        {review.rating === 1 &&
                                            <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                                <StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />
                                            </ListGroup.Item>
                                        }
                                        {review.rating === 2 &&
                                            <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                                <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />
                                            </ListGroup.Item>
                                        }
                                        {review.rating === 3 &&
                                            <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                                <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />
                                            </ListGroup.Item>
                                        }
                                        {review.rating === 4 &&
                                            <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                                <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" />
                                            </ListGroup.Item>
                                        }
                                        {review.rating === 5 &&
                                            <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0`}>
                                                <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" />
                                            </ListGroup.Item>
                                        }
                                        <p className="ms-3">{review.comment}</p>
                                    </Col>
                                </Row>
                            </Container>
                        </Container>
                    ))}
                    <Container>
                        {userInfo ? (
                            <Form noValidate className={`${darkStyleText} mt-4`} onSubmit={submitHandler}>
                                <h4>Leave your review</h4>
                                <Form.Group className="mb-2" controlId="review">
                                    <FloatingLabel controlId="review" label="Comments">
                                        <Form.Control as="textarea" placeholder="Leave a comment here" name="review" value={comment} onChange={(e) => setComment(e.target.value)} style={{ resize: 'none' }} maxLength={250} />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="rating">
                                    <ListGroup.Item className={`${darkStyleText} ${darkStyleBackground} border-0 fs-2`}>
                                        {stars.star1 ? <StarFill className="text-warning" id="star1" onClick={clickStarHandler} /> : <Star className="text-warning" id="star1" onClick={clickStarHandler} />}
                                        {stars.star2 ? <StarFill className="text-warning mx-2" id="star2" onClick={clickStarHandler} /> : <Star className="text-warning mx-2" id="star2" onClick={clickStarHandler} />}
                                        {stars.star3 ? <StarFill className="text-warning" id="star3" onClick={clickStarHandler} /> : <Star className="text-warning" id="star3" onClick={clickStarHandler} />}
                                        {stars.star4 ? <StarFill className="text-warning mx-2" id="star4" onClick={clickStarHandler} /> : <Star className="text-warning mx-2" id="star4" onClick={clickStarHandler} />}
                                        {stars.star5 ? <StarFill className="text-warning" id="star5" onClick={clickStarHandler} /> : <Star className="text-warning" id="star5" onClick={clickStarHandler} />}
                                    </ListGroup.Item>
                                </Form.Group>
                                <Button variant="warning" type="submit" className="w-100 mb-3">
                                    Submit
                            </Button>
                            </Form>
                        ) : (
                                <h2>Please {' '} <Link href={`/login?redirect=/product/${product.slug}`}>Login</Link>{' '}to write a review</h2>
                            )}
                    </Container>
                </Card>}
        </Layout>
    )
}
export default ProductScreen

export async function getServerSideProps(context) {
    const { slug } = context.params
    await db.connect()
    const product = await Product.findOne({ slug }, '-reviews').lean()
    await db.disconnect()
    return {
        props: {
            product: db.convertDocToObj(product)
        }
    }
}