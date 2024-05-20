import ChatList from "../ChatList/ChatList"
import ProfileCard from "../ProfileCard/ProfileCard"
import "./Sidebar.scss"

const Sidebar = () => {
    return (
        <div className="main-sidebar">
            <ProfileCard />
            <ChatList />
        </div>
    )
}

export default Sidebar