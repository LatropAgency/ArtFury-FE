import {Link as RouterLink} from "react-router-dom";
import {Link} from "@mui/material";
import {useEffect, useState} from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export function OrderItem({order}) {
    const [creationDate, setCreationDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const date = new Date(order.created_at)
        setCreationDate(`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`);
        setLoading(false)
    })
    return (
        <>
            {!loading && (
                <div className={'order_item'}>
                    <RouterLink to={`/Order/${order.id}`}>
                            <h2 style={{overflowWrap: 'anywhere'}}>{order.title}</h2>
                    </RouterLink>
                    <RouterLink to={`/Author/${order.author.id}`}>
                            <span>{order.author.first_name} {order.author.last_name}</span>
                    </RouterLink>
                    <p>Категория: {order.category.name}</p>
                    <p className={'order_price'}>{order.price} р.</p>
                    <p className={'order_created_at'}><AccessTimeIcon fontSize={'18px'}/>{creationDate}</p>
                </div>
            )}
        </>

    )
}