import { useDispatch } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReviewOfSpot } from "../../store/review";

import './CreateReview.css';

const CreateReviewForm = ({spotId, setShowModal}) => {
    const dispatch = useDispatch();
    const history = useHistory();
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
        history.push(`/spots/${spotId}`)
    }

    return (
        <form className="create-review-main-container" onSubmit={handleSubmit}>
            <h1> Write a Review </h1>
            <div className="review-detail-container">
                <div className="detail">
                    <label className="label">
                        Review
                        <input
                        className="input"
                        type="text"
                        value={review}
                        onChange={e => setReview(e.target.value)}
                        />
                    </label>
                </div>
                <div className="detail">
                    <label className="label">
                        Stars
                        <input
                        className="input"
                        type="number"
                        value={stars}
                        onChange={e => setStars(e.target.value)}
                        />
                    </label>
                </div>
                <div className="button-container">
                    <button
                        className="review-submit-button"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CreateReviewForm;
