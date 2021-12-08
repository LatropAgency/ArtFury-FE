import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {APIService} from "../services/APIService";
import {useDispatch, useSelector} from "react-redux";
import {selectMode} from "../features/mode/modeSlice";
import {useNavigate, Link as RouterLink} from "react-router-dom";
import {selectUser, removeUser} from "../features/user/userSlice";
import {removeRefreshToken, selectRefreshToken} from "../features/refreshToken/refreshTokenSlice";
import {removeAccessToken, setAccessToken} from "../features/accessToken/accessTokenSlice";
import {Button, Paper, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MessageIcon from '@mui/icons-material/Message';

export function OrderDetails() {
    const {id} = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const mode = useSelector(selectMode);
    const user = useSelector(selectUser);
    const refreshToken = useSelector(selectRefreshToken);
    const [isActive, setIsActive] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [creationDate, setCreationDate] = useState('');
    const [openedImage, setOpenedImage] = useState(null)

    useEffect(() => {
        setLoading(true);
        APIService.getOrder(id).then((order_response) => {
            const date = new Date(order_response.data.created_at)
            setCreationDate(`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`);
            setOrder(order_response.data);
            setIsActive(order_response.data.is_active);
            setLoading(false);
        }).catch((error) => {
            if (error.response.status === 404 && error.response.data.detail === 'Not found.') {
                alert('Ресурс не найден');
            }
            else if (error.request.status === 401) {
                APIService.updateTokens(refreshToken).then((credentials) => {
                    dispatch(setAccessToken(credentials.data.access));
                }).catch(() => {
                    navigate('/SignIn');
                    dispatch(removeUser());
                    dispatch(removeAccessToken());
                    dispatch(removeRefreshToken());
                })
            }
        });
    }, [id])


    function handleUpdateChange(id) {
        navigate(`/Order/${id}/Update`);
    }

    function handleChatPage(id) {
        if (id)
            navigate(`/Chat/${id}`);
        else {
            APIService.createChat(
                order.id,
                order.author.id,
                user.id,
            ).then((chat_response) => {
                navigate(`/Chat/${chat_response.data.id}`);
            })
        }
    }

    function handleSwitchStatus(id) {
        APIService.switchOrderStatus(id).then((order_response) => {
            navigate(`/Order/${id}`);
            setIsActive(order_response.data.is_active);
        });
    }


    function handleSwitchImage(image) {
        const body = document.querySelector('body');
        body.style.overflow = (openedImage) ? null : "hidden";
        setOpenedImage(image);
    }

    return (
        <>
            {!loading && (
                <Paper className={'order_details'}>
                    <h1 className={'title'}>{order.title}</h1>
                    {openedImage && (
                        <div className={'opened_image'} onClick={() => {handleSwitchImage(null)}}>
                            <img src={openedImage.file} />
                        </div>
                    )}
                    {Boolean(order.image_set.length) && (
                        <Typography className={'gallery'}>
                            {order.image_set.map((image, index) => {
                                return (<img className={'gallery_item'} key={index} onClick={() => {handleSwitchImage(image)}} src={image.file}/>)
                            })}
                        </Typography>
                    )}
                    <Typography>Описание: {order.description}</Typography>
                    <Typography>Цена: {order.price} р.</Typography>
                    <Typography>Категория: <RouterLink to={`/?category=${order.category.id}`}>{order.category.name}</RouterLink> </Typography>
                    <Typography>Исполнитель: <RouterLink to={`/Author/${order.author.id}`}>{order.author.first_name} {order.author.last_name}</RouterLink></Typography>
                    <Typography>Дата публикации: {creationDate}</Typography>

                    {mode === 'customer' && order.author.id !== user.id && (
                        <Button variant="contained" onClick={() => {handleChatPage(order.chat)}}><MessageIcon/>Написать</Button>
                    )}
                    {mode === 'handler' && order.author.id === user.id && (
                        <Button onClick={() => {handleUpdateChange(order.id)}}><EditIcon/>Редактировать</Button>
                    )}
                    {mode === 'handler' && order.author.id === user.id && (
                        <Button onClick={() => {handleSwitchStatus(order.id)}}>{isActive ? 'Деактивировать' : 'Активировать'}</Button>
                    )}
                </Paper>
            )}
        </>

    )
}