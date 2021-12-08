import {Routes, Route} from 'react-router-dom';
import {SignIn} from "./SignIn";
import {SignUp} from "./SignUp";
import {Profile} from "./Profile";
import {OrderList as CustomerOrderList} from "./customer/OrderList";
import {OrderList as HandlerOrderList} from "./handler/OrderList";
import {ChatList} from "./ChatList";
import {useSelector} from "react-redux";
import {selectMode} from "../features/mode/modeSlice";
import {AuthorDetails} from "./AuthorDetails";
import {OrderDetails} from "./OrderDetails";
import {CreateOrder} from "./CreateOrder";
import {UpdateOrder} from "./UpdateOrder";
import {ChatDetails} from "./ChatDetails";
import {Container} from "@mui/material";

export function Main({data, setData}) {
    const mode = useSelector(selectMode);
    return (
        <main>
            <Container>
                <Routes>
                    {mode === "customer" && (
                        <Route path='/' element={<CustomerOrderList/>}/>
                    )}
                    {mode === "handler" && (
                        <Route path='/' element={<HandlerOrderList/>}/>
                    )}
                    <Route path='/SignIn' element={<SignIn setData={setData}/>}/>
                    <Route path='/SignUp' element={<SignUp/>}/>
                    <Route path='/Profile' element={<Profile data={data}/>}/>
                    <Route path='/ChatList' element={<ChatList/>}/>
                    <Route path='/Chat/:id' element={<ChatDetails/>}/>
                    <Route path='/Author/:id' element={<AuthorDetails/>}/>
                    <Route path='/Order/:id' element={<OrderDetails/>}/>
                    <Route path='/Order/Create' element={<CreateOrder/>}/>
                    <Route path='/Order/:id/Update' element={<UpdateOrder/>}/>
                </Routes>
            </Container>
        </main>
    )
}