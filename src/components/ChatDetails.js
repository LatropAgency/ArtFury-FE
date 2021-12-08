import {useEffect, useState} from "react";
import {APIService} from "../services/APIService";
import {removeAccessToken, setAccessToken} from "../features/accessToken/accessTokenSlice";
import {removeUser, selectUser} from "../features/user/userSlice";
import {removeRefreshToken, selectRefreshToken} from "../features/refreshToken/refreshTokenSlice";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {Button, InputLabel, Paper, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function ChatDetails() {
    const {id} = useParams();
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector(selectUser);
    const refreshToken = useSelector(selectRefreshToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [isLast, setIsLast] = useState(true);
    const [message, setMessage] = useState('');
    const [chatSocket, setChatSocket] = useState(null);
    const [messagesState, setMessagesState] = useState({messages: []});


    function onMessage(e) {
        const new_message_data = JSON.parse(e.data);
        console.log('New message is received');
        console.log(new_message_data);
        console.log(messagesState.messages)
        const messagesUpdated = {
            messages: [new_message_data, ...messagesState.messages]
        }
        console.log(messagesUpdated);
        setMessagesState((pref) => {
            return {
                messages: [new_message_data, ...pref.messages]
            }
        })
        //
        // for (const [key, value] of Object.entries(messagesState)) {
        //     messagesState[key] = [new_message_data, ...messagesState.messages]
        //     setMessagesState(JSON.parse(JSON.stringify(messagesState)))
        // }
    }

    function onClose(e) {
        console.error('Chat socket closed unexpectedly');
    }

    useEffect(() => {
        setLoading(true);
        const socketPath = `ws://localhost:8000/ws/${id}/`;
        const newChatSocket = new WebSocket(socketPath)
        newChatSocket.onmessage = onMessage;
        newChatSocket.onclose = onClose;

        APIService.getChat(id).then((chat_response) => {
            setChat(chat_response.data);
            setChatSocket(newChatSocket);
            setPage(1);
            setLoading(false);
        }).catch((error) => {
            if (error.response.status === 404 && error.response.data.detail === 'Not found.') {
                alert('Ресурс не найден');
            } else if (error.request.status === 401) {
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
    }, [user, id])

    useEffect(() => {
        console.log(page)
        APIService.getChatMessages(id, page).then((messages_response) => {
            const messagesUpdated = {
                messages: [...messagesState.messages, ...messages_response.data.results]
            }
            console.log(messagesUpdated)
            setMessagesState(messagesUpdated)
            setIsLast(!Boolean(messages_response.data.next));
        })
    }, [page])

    function handleMessageChange(event) {
        setMessage(event.target.value);
    }

    function handleLoadMore() {
        setPage(page + 1);
    }

    function handleSendMessage() {
        chatSocket.send(JSON.stringify({'text': message, 'sender_id': user.id, 'message_type': 1, 'chat_id': chat.id}));
        setMessage('');
    }

    return (
        <>
            {!loading && (
                <Paper className={'chat_section'}>
                    <h1 style={{overflow: "ellipse"}} className={'title'}>Чат <Link to={`/Order/${chat.order.id}`}>{chat.order.title}</Link></h1>
                    <InputLabel>Cообщение:</InputLabel>
                    <div className={'create_message_form'}>
                        <TextField
                            multiline
                            value={message}
                            onChange={handleMessageChange}
                            required
                            fullWidth
                        />
                        <Button disabled={!Boolean(message)} variant={"contained"} onClick={handleSendMessage}><SendIcon/></Button>
                    </div>
                    <div className={'message_list'}>
                        {messagesState.messages.map(({id, text, sender}) => {
                            return (
                                <div key={id} className={'message_item'}>
                                    <span className={(user.id === sender.id) ? 'message_content right_messages' : 'message_content left_messages'}>{text}</span>
                                </div>
                            )
                        })}
                        {!isLast && (
                            <Button onClick={handleLoadMore}>Ещё</Button>
                        )}
                    </div>
                </Paper>
            )}
        </>
    )
}