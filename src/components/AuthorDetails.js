import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {APIService} from "../services/APIService";
import {Button, Paper, TextField} from "@mui/material";
import { makeStyles } from '@mui/styles';
import SendIcon from '@mui/icons-material/Send';
import {useSelector} from "react-redux";
import {selectUser} from "../features/user/userSlice";
import {Link} from "react-router-dom";
import {Comment} from "@mui/icons-material";
import {CommentItem} from "./CommentItem";
const useStyles = makeStyles({
    author_comment_input: {
        display: "block",
        width: '100%',
    },
});

export function AuthorDetails() {
    const {id} = useParams();
    const classes = useStyles();
    const user = useSelector(selectUser);
    const [author, setAuthor] = useState(null);
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        APIService.getAuthor(id).then((author_response) => {
            setAuthor(author_response.data);
            APIService.getAuthorComments(id).then((author_comments_response) => {
                setComments(author_comments_response.data);
                setLoading(false);
            });
        });
    }, [id])

    function handleMessageChange(event) {
        setMessage(event.target.value);
    }

    function handleCreateComment(userId, message) {
        APIService.createComment(userId, message).then(() => {
            APIService.getAuthorComments(userId).then((author_comments_response) => {
                setComments(author_comments_response.data);
                setMessage('');
            });
        });
    }

    return (
        <>
            {!loading && (
                <Paper className={'author_details'}>
                    <h1 className={'title'}>{author.first_name} {author.last_name}</h1>
                    <h1 className={'title'}>Отзывы:</h1>
                    {author.id !== user.id && (<div className={'add_comment'}>
                        <div className={'comment_form'}>
                            <TextField
                                label={'комментарий'}
                                multiline
                                onChange={handleMessageChange}
                                className={classes.author_comment_input}
                                value={message}
                                required
                                inputProps = {{minLength : 1, maxLength: 255 }}
                                fullWidth
                            />
                            <Button disabled={!Boolean(message)} variant="contained"  onClick={() => {
                                handleCreateComment(author.id, message)
                            }}><SendIcon/>Отправить
                            </Button>
                        </div>
                    </div>)}
                    <div className={'comments_list'}>
                        {comments.map((comment) => {
                            return (<CommentItem key={comment.id} comment={comment}/>
                            )
                        })}
                    </div>
                </Paper>
            )}
        </>

    )
}