import {Link as RouterLink} from "react-router-dom";
import {useEffect, useState} from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Avatar from "@mui/material/Avatar";
import * as React from "react";

export function CommentItem({comment}) {
    const [creationDate, setCreationDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const date = new Date(comment.created_at)
        setCreationDate(`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`);
        setLoading(false)
    }, [])
    return (
        <>
            {!loading && (
                <div className={'comment_item'} >
                    <Avatar sx={{
                        width: 70,
                        height: 70,
                        marginRight: '20px',
                        fontSize: '40px'
                    }}>{comment.author.first_name[0]}{comment.author.last_name[0]}</Avatar>
                    <div className={'comment_item_content'}>
                        <RouterLink to={`/Author/${comment.author.id}`}>{comment.author.first_name} {comment.author.last_name}</RouterLink>
                        <p>{comment.message}</p>
                        <p className={'comment_created_at'}><AccessTimeIcon fontSize={'18px'}/>{creationDate}</p>
                    </div>
                </div>
            )}
        </>

    )
}