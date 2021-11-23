import React, { Fragment, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Container, Dropdown, DropdownButton, Button, Form, InputGroup, Row, Col, Card, Pagination } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';
import { XCircleFill, StarFill, Star, StarHalf } from 'react-bootstrap-icons';
import { addCartItem } from '../store/cart-slice';
import db from '../utils/db'
import Product from '../models/Product';

const prices = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $200',
        value: '51-200',
    },
    {
        name: '$201 to $1000',
        value: '201-1000',
    },
];

const ratings = [1, 2, 3, 4, 5];
const PAGE_SIZE = 3;

export default function Search(props) {
    const [part, setPart] = useState(1)
    const router = useRouter();
    const dispatch = useDispatch()
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const cartItems = useSelector((state) => state.cart.cartItems);
    const {
        query = 'all',
        category = 'all',
        brand = 'all',
        price = 'all',
        rating = 'all',
        sort = 'featured',
    } = router.query;
    const { products, countProducts, categories, brands, pages } = props;
    const filterSearch = ({
        page,
        category,
        brand,
        sort,
        min,
        max,
        searchQuery,
        price,
        rating,
    }) => {
        const path = router.pathname;
        const { query } = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : query.min === 0 ? 0 : min;
        if (max) query.max ? query.max : query.max === 0 ? 0 : max;
        router.push({
            pathname: path,
            query: query,
        });
    };
    const categoryHandler = (e, page) => {
        setPart(1);
        page = 1
        filterSearch({ page,category: e });
    };
    const firstPageHandler = (e, page) => {
        setPart(1);
        page = 1
        filterSearch({ page });
    };
    const lastPageHandler = (e, page) => {
        setPart(pages);
        page = pages
        filterSearch({ page });
    };
    const nextPageHandler = (e, page) => {
        if (part < pages) {
            setPart(part + 1);
            page = part + 1
            filterSearch({ page });
        }
    };
    const perviousPageHandler = (e, page) => {
        if (part <= 1) {
            return
        } else {
            setPart(part - 1);
            page = part - 1
            filterSearch({ page });
        }
    };
    const brandHandler = (e, page) => {
        setPart(1);
        page = 1
        filterSearch({ page,brand: e });
    };
    const sortHandler = (e) => {
        filterSearch({ sort: e });
    };
    const priceHandler = (e, page) => {
        setPart(1);
        page = 1
        filterSearch({ page,price: e });
    };
    const ratingHandler = (e, page) => {
        setPart(1);
        page = 1
        filterSearch({ page,rating: e });
    };

    const addToCartHandler = async (product) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            toast.success('Sorry. Product is out of stock');
            return;
        }
        dispatch(addCartItem({ data }))
        router.push('/cart');
    };

    return (
        <Layout title="Search">
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
            <Container fluid>
                <Row className="row">
                    <Col className="col-3 d-flex flex-column justify-content-start p-3">
                        <Card className="bg-secondary p-5">
                            <h5 className="mb-2">Categories</h5>
                            <DropdownButton
                                variant="outline-white"
                                className="text-dark border border-dark border-start-0 border-top-0 border-end-0 rounded-0 mb-2"
                                title={category}
                                id="dropdown-menu"
                                onSelect={categoryHandler}
                            >
                                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                                {categories && categories.map((category) => (
                                    <Dropdown.Item key={category} eventKey={category}>{category}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <h5 className="mb-2">Brands</h5>
                            <DropdownButton
                                variant="outline-white"
                                className="text-dark border border-dark border-start-0 border-top-0 border-end-0 rounded-0 mb-2"
                                title={`${brand}`}
                                id="dropdown-menu"
                                onSelect={brandHandler}
                            >
                                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                                {brands && brands.map((brand) => (
                                    <Dropdown.Item key={brand} eventKey={brand}>{brand}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <h5 className="mb-2">Prices</h5>
                            <DropdownButton
                                variant="outline-white"
                                className="text-dark border border-dark border-start-0 border-top-0 border-end-0 rounded-0 mb-2"
                                title={`${price}`}
                                id="dropdown-menu"
                                onSelect={priceHandler}
                            >
                                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                                {prices.map((price) => (
                                    <Dropdown.Item key={price.value} eventKey={price.value}>{price.name}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <h5 className="mb-2">Ratings</h5>
                            <DropdownButton
                                variant="outline-white"
                                className="text-dark border border-dark border-start-0 border-top-0 border-end-0 rounded-0 mb-2"
                                title={`${rating}`}
                                id="dropdown-menu"
                                onSelect={ratingHandler}
                            >
                                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                                {ratings.map((rating) => (
                                    <Dropdown.Item key={rating} eventKey={rating}>{`${rating} & up`}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Card>
                    </Col>
                    <Col className="col-9 pt-3">
                        <Container fluid className="d-flex justify-content-between align-items-center">
                            <h5>{products.length === 0 ? 'No' : countProducts} Results
                            {query !== 'all' && query !== '' && ' : ' + query}
                                {category !== 'all' && ' : ' + category}
                                {brand !== 'all' && ' : ' + brand}
                                {price !== 'all' && ' : Price ' + price}
                                {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                                {(query !== 'all' && query !== '') ||
                                    category !== 'all' ||
                                    brand !== 'all' ||
                                    rating !== 'all' ||
                                    price !== 'all' ? (
                                        <Button onClick={() => router.push('/search')} className="rounded rounded-circle rounded-3 bg-transparent border-0 m-0 p-0 ms-1" size="sm" id="close-btn">
                                            <XCircleFill className="text-danger h4" id="close" />
                                        </Button>
                                    ) : null}
                            </h5>
                            <DropdownButton
                                variant="outline-white"
                                className="text-dark border border-dark border-start-0 border-top-0 border-end-0 rounded-0 mb-2"
                                title={`Sort by ${sort}`}
                                id="dropdown-menu"
                                onSelect={sortHandler}
                            >
                                <Dropdown.Item eventKey="featured">Featured</Dropdown.Item>
                                <Dropdown.Item eventKey="lowest">Price: Low to High</Dropdown.Item>
                                <Dropdown.Item eventKey="highest">Price: High to Low</Dropdown.Item>
                                <Dropdown.Item eventKey="toprated">Customer Reviews</Dropdown.Item>
                                <Dropdown.Item eventKey="newest">Newest Arrivals</Dropdown.Item>
                            </DropdownButton>
                        </Container>
                        <Row className="row">
                            {products.map((product) => {
                                return (
                                    <Col className="col-md-4 col-sm-6 d-flex justify-content-around my-2" key={product.name}>
                                        <Card style={{ width: '18rem' }} className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                            <Link href={`/product/${product.slug}`} passHref>
                                                <a className="p-0">
                                                    <Image width="286" height="286" src={product.image} id="card-image" className="mb-2" alt={`${product.name}`} />
                                                    {/* <Card.Img variant="top" src={product.image} id="card-image" className="mb-2" /> */}
                                                </a>
                                            </Link>
                                            <Card.Body>
                                                <Card.Title className={`${darkStyleText}`}>{product.name}</Card.Title>
                                                {product.rating === 0 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating < 1 && product.rating > 0 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating === 1 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating < 2 && product.rating > 1 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating === 2 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating < 3 && product.rating > 2 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating === 3 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating < 4 && product.rating > 3 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating === 4 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating < 5 && product.rating > 4 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                                {product.rating === 5 &&
                                                    <Card.Text className={`${darkStyleText} border-0`}>
                                                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" />({product.numReviews} reviews)
                                                    </Card.Text>
                                                }
                                            </Card.Body>
                                            <Card.Body style={{ marginTop: '-1.5rem' }} className="d-flex justify-content-start">
                                                <Card.Text className={`${darkStyleText} fw-bold me-3`}>${product.price}</Card.Text>
                                                <Card.Link style={{ cursor: 'pointer' }} className="text-uppercase text-warning text-decoration-none fw-bold" onClick={() => addToCartHandler(product)}>add to cart</Card.Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                        {countProducts < 1 ? '' :
                            <Pagination className="ms-0">
                                <Pagination.First onClick={firstPageHandler} />
                                <Pagination.Prev onClick={perviousPageHandler} />
                                <Pagination.Item active>{part}</Pagination.Item>
                                {/* <Pagination.Ellipsis /> */}
                                <Pagination.Next onClick={nextPageHandler} />
                                <Pagination.Last onClick={lastPageHandler} />
                            </Pagination>}
                    </Col>
                </Row>
            </Container>
        </Layout >
    )
}

export async function getServerSideProps({ query }) {
    await db.connect();
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const sort = query.sort || '';
    const searchQuery = query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                name: {
                    $regex: searchQuery,
                    $options: 'i',
                },
            }
            : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const brandFilter = brand && brand !== 'all' ? { brand } : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                    $gte: Number(rating),
                },
            }
            : {};
    // 10-50
    const priceFilter =
        price && price !== 'all'
            ? {
                price: {
                    $gte: Number(price.split('-')[0]),
                    $lte: Number(price.split('-')[1]),
                },
            }
            : {};

    const order =
        sort === 'featured'
            ? { featured: -1 }
            : sort === 'lowest'
                ? { price: 1 }
                : sort === 'highest'
                    ? { price: -1 }
                    : sort === 'toprated'
                        ? { rating: -1 }
                        : sort === 'newest'
                            ? { createdAt: -1 }
                            : { _id: -1 };

    const categories = await Product.find().distinct('category');
    const brands = await Product.find().distinct('brand');
    const productDocs = await Product.find(
        {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...brandFilter,
            ...ratingFilter,
        },
        '-reviews'
    )
        .sort(order)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
    });
    await db.disconnect();

    const products = productDocs.map(db.convertDocToObj);

    return {
        props: {
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
            categories,
            brands,
        },
    };
}