import "./ProfileCard.scss"

const ProfileCard = () => {
    const username = localStorage.getItem('username');
    return (
        <div className="main-profile-card">
            <div className="pic-name">
                <img className="profile-picture" src='https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg' alt="image" />
                <div className="info">
                    <span className="username">{username === "Dwarkesh" ? "Dwarkesh" : "Punit"}</span>
                    <span className="status">Active</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard