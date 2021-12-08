import {APIService} from "../services/APIService";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {Button, InputLabel, MenuItem, Paper, Select, TextField, Typography} from "@mui/material";
import {makeStyles} from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles({
    order_description_input: {
        display: "block",
        width: '100%',
    },
});
export const UpdateOrder = () => {
    const classes = useStyles();
    const {id} = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [openedImage, setOpenedImage] = useState(null)
    const [images, setImages] = useState({});
    const [title, setTitle] = useState(null);
    const [category, setCategory] = useState(1);
    const [description, setDescription] = useState(null);
    const [price, setPrice] = useState(1);

    function handleSwitchImage(image) {
        const body = document.querySelector('body');
        body.style.overflow = (openedImage) ? null : "hidden";
        setOpenedImage(image);
    }


    useEffect(async () => {
        setLoading(true);
        let order_response = await APIService.getOrder(id)
        let categories_response = await APIService.getCategories()
        setCategories(categories_response.data);
        setOrder(order_response.data);
        setTitle(order_response.data.title)
        setPrice(order_response.data.price)
        setDescription(order_response.data.description)
        setCategory(order_response.data.category.id)
        order_response.data.image_set.map(
            async (image, index) => {
                setImages((pref) => {
                    pref[index] = image
                    return pref;
                })
            })
        console.log(images);
        setLoading(false);
    }, [id])


    function handleTitleChange(event) {
        order.title = event.target.value;
        setTitle(event.target.value)
    }

    function handleCategoryChange(event) {
        order.category.id = event.target.value;
        setCategory(event.target.value)
    }

    function handleDescriptionChange(event) {
        order.description = event.target.value;
        setDescription(event.target.value)
    }

    function handlePriceChange(event) {
        if (Number.parseInt(event.target.value)) {
            order.price = Number.parseInt(event.target.value);
            setPrice(Number.parseInt(event.target.value));
        }
    }

    function handleUpdateOrder() {
        let existingImages = [];
        const formData = new FormData();
        Object.keys(images).map((key, index) => {
            console.log(images[key])
            if (images[key].id)
                existingImages.push(images[key].id)
            else
                formData.append(index, images[key].file);
        })
        formData.append('images', existingImages.join(','));
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        APIService.updateOrder(
            order.id,
            formData
        ).then((order_response) => {
            navigate(`/Order/${order_response.data.id}`);
        })
    }


    function handleDeleteImage(key) {
        delete images[key];
        setImages(JSON.parse(JSON.stringify(images)));
    }

    function handleImageChange(event) {
        let maxKey = 0;
        Object.keys(images).map((key) => {
            maxKey = Number.parseInt(key) > maxKey ? Number.parseInt(key) : maxKey;
        })
        if (event.target.files.length) {
            console.log(event.target.files[0])
            images[maxKey + 1] = {
                // file: URL.createObjectURL(event.target.files[0]),
                file: event.target.files[0],
                urlFile: URL.createObjectURL(event.target.files[0]),
            }
            // setImages(JSON.parse(JSON.stringify(images)));
            setImages({...images});
            console.log(images)
        }
    }

    return (
        <>
            {!loading && (
                <Paper className={'update_order'}>
                    <h1 className={'title'}>Форма создания товара</h1>
                    <InputLabel>Заголовок:</InputLabel>
                    <TextField name='title' type='text' inputProps={{minLength: 1, maxLength: 128}}
                               defaultValue={order.title} fullWidth required
                               onChange={handleTitleChange}/>
                    {openedImage && (
                        <div className={'opened_image'} onClick={() => {
                            handleSwitchImage(null)
                        }}>
                            (<img src={openedImage.urlFile ? openedImage.urlFile: openedImage.file}/>)

                        </div>
                    )}
                    {Boolean(Object.keys(images).length) && (
                        <Typography className={'gallery'} style={{height: '260px'}}>
                            {Object.keys(images).map((key, index) => {
                                return (
                                    <div style={{position: 'relative'}}>
                                        <img className={'gallery_item'} key={index} onClick={() => {
                                            handleSwitchImage(images[key])
                                        }} src={images[key].urlFile ? images[key].urlFile: images[key].file}/>
                                        <Button style={{display: 'block', margin: "auto"}} onClick={() => {
                                            handleDeleteImage(key)
                                        }}>
                                            <DeleteIcon/>
                                        </Button>
                                    </div>
                                )
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
                        label={'категория'}
                        onChange={handleCategoryChange}
                        defaultValue={order.category.id}
                        fullWidth
                    >
                        {categories.map(({id, name}) => {
                            return (<MenuItem key={id} value={id}>{name}</MenuItem>)
                        })}
                    </Select>
                    <InputLabel>Цена:</InputLabel>
                    <TextField
                        type="number"
                        value={price}
                        placeholder={'цена'}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        InputProps={{inputProps: {min: 1, max: 9223372036854775807}}}
                        onChange={handlePriceChange}
                    />
                    <InputLabel>Описание:</InputLabel>
                    <TextField
                        multiline
                        onChange={handleDescriptionChange}
                        className={classes.order_description_input}
                        defaultValue={order.description}
                        required
                        fullWidth
                    />
                    <Button
                        disabled={!Boolean(title && description && category && (price !== null && price !== undefined && price !== ""))}
                        onClick={handleUpdateOrder}>Обновить</Button>
                    <Link to={`/Order/${id}`}><Button>Отмена</Button></Link>
                </Paper>
            )}
        </>
    )
}