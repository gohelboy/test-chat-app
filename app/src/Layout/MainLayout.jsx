import ChatWindow from "../Components/ChatWindow/ChatWindow"
import Sidebar from "../Components/Sidebar/Sidebar"
import "./MainLayout.scss"

const MainLayout = () => {

    return (
        <div className="main-layout">
            <Sidebar />
            <ChatWindow />
        </div>
    )
}

export default MainLayout