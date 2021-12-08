import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIService} from "../../services/APIService";
import {useLocation} from "react-router";
import {OrderItem} from "../OrderItem";
import {Button, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {ArrowBackIos} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export function OrderList() {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();
    const [title, setTitle] = useState(null);
    const [author, setAuthor] = useState(0);
    const [category, setCategory] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [params, setParams] = useState({});
    const {search} = useLocation();
    const [loading, setLoading] = useState(true);

    function handleMinPriceChange(event) {
        setMinPrice(Number.parseInt(event.target.value));
    }

    function handleMaxPriceChange(event) {
        setMaxPrice(Number.parseInt(event.target.value));
    }
    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    function handleCategoryChange(event) {
        setCategory(Number.parseInt(event.target.value));
    }

    function handleAuthorChange(event) {
        setAuthor(Number.parseInt(event.target.value));
    }

    function handleResetFilters() {
        navigate('/');
        setParams({page: 1});
        setMaxPrice('');
        setMinPrice('');
        setCategory(0);
        setTitle('');
        setAuthor(0)
    }

    function handleFilterOrders() {
        let newParams = {}
        if (author) newParams.author = author;
        if (title) newParams.search = title;
        if (category) newParams.category = category;
        if (maxPrice) newParams.max_price = maxPrice;
        if (minPrice) newParams.min_price = minPrice;
        newParams.page = 1
        setParams(newParams);
    }

    function handleNextPage() {
        let newParams = JSON.parse(JSON.stringify(params));
        newParams.page = params.page ? params.page + 1 : 1
        setParams(newParams);
    }

    function handlePrevPage() {
        let newParams = JSON.parse(JSON.stringify(params));
        newParams.page = params.page > 1 ? params.page - 1 : 1
        setParams(newParams);
    }

    useEffect(async () => {
        let newParams = {}
        const queryParams = new URLSearchParams(search);
        const pageParam = queryParams.get('page');
        const categoryParam = queryParams.get('category');
        const authorParam = queryParams.get('author');
        const titleParam = queryParams.get('search');
        const minPriceParam = queryParams.get('min_price');
        const maxPriceParam = queryParams.get('max_price');
        if (authorParam) newParams.author = Number.parseInt(authorParam);
        if (titleParam) newParams.search = titleParam;
        if (categoryParam) newParams.category = Number.parseInt(categoryParam);
        if (minPriceParam) newParams.min_price = Number.parseInt(minPriceParam);
        if (maxPriceParam) newParams.max_price = Number.parseInt(maxPriceParam);
        if (pageParam) newParams.page = Number.parseInt(pageParam);
        else newParams.page = 1
        if (newParams.min_price) setMinPrice(newParams.min_price);
        if (newParams.max_price) setMaxPrice(newParams.max_price);
        if (newParams.author) setAuthor(newParams.author);
        if (newParams.category) setCategory(newParams.category);
        if (newParams.search) setTitle(newParams.search);
        let authors_response = await APIService.getAuthors();
        let categories_response = await APIService.getCategories();
        setAuthors(authors_response.data);
        setCategories(categories_response.data);
        setParams(newParams)
        setLoading(false)
    }, [])

    useEffect(async () => {
        let orders_response = await APIService.getOrders(params);
        setNext(orders_response.data.next);
        setPrevious(orders_response.data.previous);
    }, [orders])

    useEffect(async () => {

        let filters = []
        if (params.page) {
            filters = [...filters, `page=${params.page}`]
        }
        if (params.category) {
            filters = [...filters, `category=${params.category}`]
        }
        if (params.author) {
            filters = [...filters, `author=${params.author}`]
        }
        if (params.search) {
            filters = [...filters, `search=${params.search}`]
        }
        if (params.min_price) {
            filters = [...filters, `min_price=${params.min_price}`]
        }
        if (params.max_price) {
            filters = [...filters, `max_price=${params.max_price}`]
        }
        navigate(filters ? `/?${filters.join('&')}` : '/');

        let orders_response = await APIService.getOrders(params);

        setOrders(orders_response.data.results);

    }, [params])

    return (
        <section className={'orders_section'}>
            <Paper className={'order_filters'}>
                {!loading && (
                    <>
                        <InputLabel>Заголовок:</InputLabel>
                        <TextField
                            value={title}
                            onChange={handleTitleChange}
                        />
                        <InputLabel>Категория:</InputLabel>
                        <Select
                            label="Category"
                            onChange={handleCategoryChange}
                            value={category}
                        >
                            {categories.map(({id, name}) => {
                                return (<MenuItem key={id} value={id}>{name}</MenuItem>)
                            })}
                        </Select>
                        <InputLabel>Исполнитель:</InputLabel>
                        <Select
                            label="Author"
                            onChange={handleAuthorChange}
                            value={author}
                        >
                            {authors.map(({id, first_name, last_name}) => {
                                return (<MenuItem key={id} value={id}>{first_name} {last_name}</MenuItem>)
                            })}
                        </Select>
                        <InputLabel>Цена:</InputLabel>
                        <TextField inputProps = {{min : 1, max: maxPrice }} type={'number'} value={minPrice} placeholder={'от'} onChange={handleMinPriceChange}/>
                        <TextField inputProps = {{min : 1, max: 9223372036854775807 }} type={'number'} value={maxPrice} placeholder={'до'}
                                   onChange={handleMaxPriceChange}/>
                        <Button onClick={handleFilterOrders}><SearchIcon/>Поиск</Button>
                        <Button onClick={handleResetFilters}><RestartAltIcon/>Сбросить</Button>
                    </>
                )}
                <h2 className={'title'}>Фильтры:</h2>
            </Paper>
            <Paper className={'order_list'}>
                <h2 className={'title'}>Товары:</h2>
                <div className={'items'}>
                    { orders.length ?
                        orders.map((order) => {
                            return (
                                <OrderItem key={order.id} order={order}/>
                            )
                        })
                        : (
                            <div className={'empty_result'}>
                                Пусто
                            </div>
                        )
                    }
                </div>
                <div className={'pagination_buttons'}>
                    {previous && (<Button onClick={() => {
                        handlePrevPage(params.page - 1)
                    }}><ArrowBackIos/>Назад</Button>)}
                    {next && (<Button onClick={() => {
                        handleNextPage(params.page + 1)
                    }}>Вперёд<ArrowForwardIosIcon/></Button>)}
                </div>
            </Paper>
        </section>
    )
}