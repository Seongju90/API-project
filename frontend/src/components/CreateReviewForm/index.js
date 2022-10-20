import { useDispatch } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReviewOfSpot } from "../../store/review";

const CreateReviewForm = ({spotId, setShowModal}) => {
    const dispatch = useDispatch();
    // const history = useHistory();
    // console.log('create', spotId)
    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            review,
            stars
        }

        await dispatch(createReviewOfSpot(newReview, spotId))
        setShowModal(false)
        // history.push(`/spots/${spotId}`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Review
                <input
                type="text"
                value={review}
                onChange={e => setReview(e.target.value)}
                />
            </label>
            <label>
                Stars
                <input
                type="number"
                value={stars}
                onChange={e => setStars(e.target.value)}
                />
            </label>
            <button
                type="submit"
            >
                Submit
            </button>
        </form>
    );
}

export default CreateReviewForm;
