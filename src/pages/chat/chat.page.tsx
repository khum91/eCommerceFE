import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { Card, Avatar } from 'flowbite-react';
import chatService from "./chat.service";
import { useSelector } from "react-redux";
import socket from "../../config/socket.config";

export const ChatUser = ({ user, clickEvent, isActive = false }: { user: SingleUser, clickEvent: any, isActive: boolean }) => {
    return (<>
        <div className={`inline-flex items-center gap-1 py-1 shadow-lg ${isActive ? 'bg-green-100' : ' bg-gray-100'} hover:bg-blue-300 hover:cursor-pointer`} onClick={(e) => { clickEvent(user._id) }}>
            <div className="w-1/4 mx-3">
                <img src={user.image ? import.meta.env.VITE_IMAGE_URL + '/user/' + user.image : 'https://placehold.co/400'} className="rounded-full" alt="" />
            </div>
            <div>
                <h1 className="bold">{user.name}</h1>
                <p className=" text-xs italic">{user.email}</p>
                <small className="text-xs italic text-gray-500">
                    {user?.message[0]?.message}
                </small>
            </div>
        </div>
    </>)
}

export interface UserDetail {
    _id: string,
    name: string,
    email: string,
    image: string
}

export interface Singlemesage {
    _id: string,
    sender: UserDetail,
    receiver: UserDetail,
    date: Date,
    message: string
}
export interface SingleUser {
    _id: string,
    name: string,
    email: string,
    image: string,
    message: Singlemesage[]
}

const ChatListView = () => {

    const [userList, setUserList] = useState<SingleUser[]>();

    const [currentChat, setCurrentChat] = useState<any>()

    const [message, setCurrentMessage] = useState<string>('');

    const currentUser = useSelector((root: any) => {
        return root.auth.loggedInUser || null;
    })

    const loadAllUsers = async () => {
        try {
            const response: any = await chatService.getRequest('/chat/chat-list', { auth: true })
            setUserList(response.result)
        } catch (error) {
            toast.error('Error loading user list.')
        }
    }
    useEffect(() => {
        loadAllUsers()
        const newMessageReceived = (data: any) => {
            if (data.receiver === currentUser._id) {
                getDetailChat(data.sender)
            }
        }
        socket.on('message-received', newMessageReceived);
        return () => {
            socket.off('message-received', newMessageReceived)
        }
    }, [])

    const sendChat = async (e: any) => {
        e.preventDefault()
        try {
            const msg = {
                sender: currentUser._id,
                receiver: currentChat.sender._id,
                message: message
            }
            const response = await chatService.postRequest('/chat/store', msg, { auth: true })
            setCurrentMessage('');
            setCurrentChat({
                ...currentChat,
                list: [
                    ...currentChat.list,
                    response.result
                ]
            })
            socket.emit('message-sent', { sender: currentUser._id, receiver: currentChat.sender._id })
        } catch (error) {
            toast.error('An error occurred while sending the message.')
        }
    }

    const getDetailChat = async (senderId: string) => {
        try {
            socket.connect()
            const response: any = await chatService.getRequest('/chat/chat-detail/' + senderId, { auth: true })
            setCurrentChat(response.result)

        } catch (exception) {
            toast.error('Error loading chat detail.')
        }
    }

    return (<>
        <div className="md:flex lg: flex sm:grid-cols-1 md: mx-20 py-5 gap-2 mt-5 min-h-screen">
            <div className=" flex flex-col gap-3  w-1/4 bg-gray-200">
                {
                    userList && userList.map((row: SingleUser, i: number) => (
                        <ChatUser isActive={currentChat && currentChat.sender._id === row._id ? true : false} clickEvent={getDetailChat} user={row} key={i} />
                    ))
                }
            </div>
            <div className="w-3/4 ">
                <Card >
                    <div className="h-96 overflow-scroll overscroll-none">
                        {currentChat && currentChat.list.map((message: any, index: number) => (
                            <div key={index} className={`flex items-start mb-4 ${message?.sender?._id === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                                <Avatar img={message.sernderAvatar} rounded={true} className="ml-2" />
                                {/* {
                                    message?.sender?._id !== currentUser._id && (
                                        <Avatar img={message.sernderAvatar} rounded={true} className="mr-2" />)
                                } */}
                                <div className={`rounded-lg px-4 py-2 ${message?.sender?._id === currentUser._id ? 'bg-blue-200 text-white' :
                                    'bg-gray-200 text-gray-900'}max-w-xs`}>
                                    <p>{message.message}</p>
                                    <small className="block mt-1 text-xs text-gray-600">
                                        {new Date(message.date).toLocaleTimeString()}
                                    </small>
                                </div>
                                {/* {message?.sender?._id === currentUser._id && (
                                    <Avatar img={message.sernderAvatar} rounded={true} className="ml-2" />)
                                } */}
                            </div>
                        ))
                        }
                    </div>
                    <div className="mt-4">
                        <form onSubmit={sendChat}>
                            <input type="text" placeholder="Type a message" className="w-full border-gray-400 rounded-lg" onChange={(e: any) => {
                                setCurrentMessage(e.target.value)
                            }} value={message} />
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    </>)
}
export default ChatListView;