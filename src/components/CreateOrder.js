import {useEffect, useState} from "react";
import {APIService} from "../services/APIService";
import {Link, useNavigate} from "react-router-dom";
import {Button, ImageList, ImageListItem, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import {makeStyles} from '@mui/styles';
import React, {useCallback} from "react";
import Gallery from "react-photo-gallery";
import Carousel, {Modal, ModalGateway} from "react-images";
import Typography from "@mui/material/Typography";
import axios from "axios";

const useStyles = makeStyles(theme => ({
    order_description_input: {
        display: "block",
        width: '100%',
    },
}));

export const CreateOrder = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [title, setTitle] = useState(null);
    const [category, setCategory] = useState(1);
    const [description, setDescription] = useState(null);
    const [price, setPrice] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPath, setImagesPath] = useState([]);
    const [openedImage, setOpenedImage] = useState(null)

    function handleSwitchImage(image) {
        const body = document.querySelector('body');
        body.style.overflow = (openedImage) ? null : "hidden";
        setOpenedImage(image);
    }

    useEffect(async () => {
        let categories_response = await APIService.getCategories();
        setCategories(categories_response.data);
        setLoading(false);
    }, [])


    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    function handleCategoryChange(event) {
        setCategory(Number.parseInt(event.target.value));
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value);
    }

    function handlePriceChange(event) {
        console.log(Number.parseInt(event.target.value))
        if (Number.parseInt(event.target.value))
            setPrice(Number.parseInt(event.target.value));
    }

    function handleImageChange(event) {
        if (event.target.files.length) {
            setImages([...images, URL.createObjectURL(event.target.files[0])]);
            setImagesPath([...imagesPath, event.target.files[0]])
        }
    }

    function handleCreateOrder(event) {
        const formData = new FormData();
        imagesPath.map((imagePath, index) => {
            formData.append(index, imagePath);
        });
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        APIService.createOrder(formData).then((order_response) => {
            navigate(`/Order/${order_response.data.id}`);
        })
    }

    return (
        <>
            {!loading && (
                <Paper className={'create_order'}>
                    <h1 className={'title'}>Форма создания товара</h1>
                    <InputLabel>Заголовок:</InputLabel>
                    <TextField fullWidth name='title' type='text' required inputProps = {{minLength : 1, maxLength: 128 }} onChange={handleTitleChange}/>
                    {openedImage && (
                        <div className={'opened_image'} onClick={() => {handleSwitchImage(null)}}>
                            <img src={openedImage} />
                        </div>
                    )}
                    {Boolean(images.length) && (
                        <Typography className={'gallery'}>
                            {images.map((image, index) => {
                                return (<img onClick={() => {handleSwitchImage(image)}} className={'gallery_item'} key={index} src={image}/>)
                            })}
                        </Typography>
                    )}
                    <Button style={{margin: '10px'}} component="label" fullWidth>
                        Загрузить изображение
                        <input accept="image/*" type="file" hidden onChange={handleImageChange}/>
                    </Button>
                    <InputLabel>Категория:</InputLabel>
                    <Select
                        placeholder={'категория'}
                        label={'Категория'}
                        onChange={handleCategoryChange}
                        value={category}
                        fullWidth
                    >
                        {categories.map(({id, name}) => {
                            return (<MenuItem key={id} value={id}>{name}</MenuItem>)
                        })}
                    </Select>
                    <InputLabel>Цена:</InputLabel>
                    <TextField
                        type="number"
                        placeholder={'цена'}
                        value={price}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{inputProps: {min: 1, max: 9223372036854775807}}}
                        onChange={handlePriceChange}
                        fullWidth
                    />
                    <InputLabel>Описание:</InputLabel>
                    <TextField
                        multiline
                        onChange={handleDescriptionChange}
                        className={classes.order_description_input}
                        required
                        fullWidth
                    />
                    <Button disabled={!Boolean(title && category && (price !== null && price !== undefined && price !== "") && description)} onClick={handleCreateOrder}>Создать</Button>
                    <Link to={'/'}><Button>Отмена</Button></Link>
                </Paper>
            )}
        </>
    )
}