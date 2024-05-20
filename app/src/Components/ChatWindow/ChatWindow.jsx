import { useEffect, useRef, useState } from "react"
import "./ChatWindow.scss"
import io from "socket.io-client"

const ChatWindow = () => {
    const sender = localStorage.getItem("username");
    const receiver = sender === "Dwarkesh" ? "Punit" : "Dwarkesh";

    const [socket, setSocket] = useState(undefined);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const chatSectionRef = useRef(null);

    const getChats = async () => {
        const response = await fetch('http://192.168.1.11:5000/get-chat', {
            method: 'POST',
            body: JSON.stringify({
                sender: sender,
                receiver: receiver
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json();
        setChatMessages(data?.data?.messages)

    }

    const receiveMessage = (data) => {
        setChatMessages(prevMessages => [...prevMessages, data]);
    };

    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://192.168.1.11:5000', { query: { username: sender } });
            setSocket(newSocket);
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket, sender]);

    useEffect(() => {
        if (socket) {
            socket.on("receiveMessage", receiveMessage);
        }

        return () => {
            if (socket) {
                socket.off("receiveMessage", receiveMessage);
            }
        };
    }, [socket]);

    const send = () => {
        if (message === "" || !message.trim().length) return;
        socket.emit('sendMessage', { sender: sender, receiver: receiver, message: message.trim() });
        setMessage('');
    };

    useEffect(() => {
        getChats();
    }, []);



    const scrollToBottom = () => {
        chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    return (
        <div className="main-chat-window">
            <div className="user-header">
                <img src="https://iidamidamerica.org/wp-content/uploads/2020/12/male-placeholder-image.jpeg" alt="" />
                <span className="username">{sender ? receiver : sender}</span>
            </div>
            <div className="chat-section" ref={chatSectionRef}>
                {chatMessages && chatMessages.length > 0 && chatMessages.map((data, key) => {
                    return <div key={key} className={data.senderName === sender ? "receiver-message" : "sender-message"}>
                        <span>{data.content}</span>
                    </div>
                })}
            </div>
            <div className="inputs">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="inputbox" />
                <button onClick={send}>Send</button>
            </div>
        </div >
    )
}

export default ChatWindow