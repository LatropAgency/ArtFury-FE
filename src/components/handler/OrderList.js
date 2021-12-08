import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIService} from "../../services/APIService";
import {useLocation} from "react-router";
import {OrderItem} from "../OrderItem";
import {Button, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import {ArrowBackIos} from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export function OrderList() {
    const navigate = useNavigate();
    const [title, setTitle] = useState(null);
    const [category, setCategory] = useState(null);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [params, setParams] = useState({});
    const {search} = useLocation();
    const [loading, setLoading] = useState(true);


    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    function handleCategoryChange(event) {
        setCategory(Number.parseInt(event.target.value));
    }

    function handleResetFilters() {
        navigate('/');
        setParams({page: 1});
        setCategory(0);
        setTitle('');
    }

    function handleCreateNavigate() {
        navigate('/Order/Create');
    }

    function handleFilterOrders() {
        let newParams = {}
        if (title) newParams.search = title;
        if (category) newParams.category = category;
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
        const titleParam = queryParams.get('search');
        if (titleParam) newParams.search = titleParam;
        if (categoryParam) newParams.category = Number.parseInt(categoryParam);
        if (pageParam) newParams.page = Number.parseInt(pageParam);
        else newParams.page = 1
        if (newParams.category) setCategory(newParams.category);
        if (newParams.search) setTitle(newParams.search);
        let categories_response = await APIService.getCategories();
        setCategories(categories_response.data);
        setParams(newParams)
        setLoading(false)

    }, [])

    useEffect(async () => {
        let orders_response = await APIService.getUserOrders(params);
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
        navigate(filters ? `/?${filters.join('&')}` : '/');

        let orders_response = await APIService.getUserOrders(params);

        setOrders(orders_response.data.results);

    }, [params])

    return (
        <section className={'orders_section'}>
            <Paper className={'order_filters'}>
                {!loading && (
                    <>
                        <h2 className={'title'}>Фильтры:</h2>
                        <InputLabel>Заголовок:</InputLabel>
                        <TextField value={title} onChange={handleTitleChange}/>
                        <InputLabel>Категория:</InputLabel>
                        <Select label="Category" id="categories" value={category} onChange={handleCategoryChange}>
                            {categories.map(({id, name}) => {
                                return (<MenuItem key={id} value={id}>{name}</MenuItem>)
                            })}
                        </Select>
                        <Button onClick={handleFilterOrders}><SearchIcon/>Поиск</Button>
                        <Button onClick={handleResetFilters}><RestartAltIcon/>Сбросить</Button>
                        <Button onClick={handleCreateNavigate}><AddCircleIcon/>Создать</Button>
                    </>
                )}
            </Paper>
            <Paper className={'order_list'}>
                <h2 className={'title'}>Товары:</h2>
                <div className={'items'}>
                    {orders.length ?
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