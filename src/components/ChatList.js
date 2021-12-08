import {useEffect, useState} from "react";
import {APIService} from "../services/APIService";
import {Link, useNavigate} from "react-router-dom";
import {Button, Paper} from "@mui/material";
import {useSelector} from "react-redux";
import {selectUser} from "../features/user/userSlice";

export function ChatList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const user = useSelector(selectUser);
    const [isLast, setIsLast] = useState(true);
    const [chatsState, setChatsState] = useState({chats: []});

    useEffect(() => {
        APIService.getChats().then((chats_response) => {
            const chatsUpdated = {
                chats: [...chatsState.chats, ...chats_response.data.results]
            }
            console.log(chatsUpdated)
            setChatsState(chatsUpdated)
            setIsLast(!Boolean(chats_response.data.next));
            setLoading(false)
        })
    }, [])
    useEffect(() => {
        console.log(page)
        APIService.getChats(page).then((chats_response) => {
            const chatsUpdated = {
                chats: [...chatsState.chats, ...chats_response.data.results]
            }
            console.log(chatsUpdated)
            setChatsState(chatsUpdated)
            setIsLast(!Boolean(chats_response.data.next));
        })
    }, [page])


    function handleChatPage(id) {
        navigate(`/Chat/${id}`);
    }

    function handleLoadMore(event) {
        setPage(page + 1);
    }

    return (
        <>
            {!loading && (
                <Paper className={'chat_list'}>
                    <h1 className={'title'}>Чаты:</h1>
                    {chatsState.chats.map((chat) => {
                        return (
                            <div key={chat.id} className={'chat_item'}>
                                <div>
                                    <h1 className={'chat_title'}>{chat.order.title}</h1>
                                    {(chat.producer.id === user.id) ? (
                                        <span className={'chat_receiver'}>{chat.consumer.first_name} {chat.consumer.last_name}</span>
                                    ) : (
                                        <span className={'chat_receiver'}>{chat.producer.first_name} {chat.producer.last_name}</span>
                                    )
                                    }
                                </div>
                                <Link className={'chat_button'} to={`/Chat/${chat.id}`}>
                                    <Button  variant="contained">Продолжить переписку</Button>
                                </Link>
                            </div>
                        )
                    })}
                    {!isLast && (
                        <Button onClick={handleLoadMore}>Ещё</Button>
                    )}
                </Paper>

            )}
        </>
    )
}