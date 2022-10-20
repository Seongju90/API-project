import { useDispatch } from "react-redux";
import { deleteAReview } from "../../store/review";

// Spot details will render the review, will pass spotId as prop
const SpotReviews = ({review, userId}) => {
    // console.log("review", review)
    // console.log("userId", userId)
    const dispatch = useDispatch();

    const deleteReview = async (e) => {
        e.preventDefault()

        await dispatch(deleteAReview(review.id)).then(res => {
            const { message } = res
            alert(message)
        })
    }

    return (
        <>
            <div>
                {review.review}
                {/* conditonally render button so only users can delete own review */}
                {review.userId === userId && <button onClick={deleteReview}>Delete</button>}
            </div>
        </>
    );
}

export default SpotReviews;
