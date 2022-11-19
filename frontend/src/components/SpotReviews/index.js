import { useDispatch, useSelector } from "react-redux";
import { deleteAReview } from "../../store/review";
import './SpotReviews.css';

// Spot details will render the review, will pass spotId as prop
const SpotReviews = ({review, userId}) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.reviews.user)
    // console.log('review', review.userId)
    // console.log('user', user.id)
    const deleteReview = async (e) => {
        e.preventDefault()

        await dispatch(deleteAReview(review.id)).then(res => {
            const { message } = res
            alert(message)
        })
    }

    return (
        <div className="review-main-container">
            <div className="profile-icon-name">
                <span>
                    <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                </span>
                <div className="username-stars-container">
                    {/* if the session user is the user that created the review show their name, else old reviews */}
                    <div className="username-reviews">
                        {user?.id === review.userId
                        ? `${user?.firstName} ${user?.lastName}`
                        : `${review.User?.firstName} ${review.User?.lastName}`}
                    </div>
                    <div className="individual-reviews">
                        <i className="fa-solid fa-star"></i>
                        {review.stars}
                    </div>
                </div>
            </div>
            <div className="review">
                {review.review}
                {/* conditonally render button so only users can delete own review */}
                {review.userId === userId && <button className="delete-review-button" onClick={deleteReview}>Delete</button>}
            </div>
        </div>
    );
}

export default SpotReviews;
