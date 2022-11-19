import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react"
import { deleteASpot, getOneSpot } from "../../store/spots";
import { getReviewsOfSpot } from "../../store/review";
import { useParams, useHistory } from "react-router-dom";

import CustomModal from "../CustomModal";
import EditSpotForm from "../EditSpotForm";
import SpotReviews from "../SpotReviews";
import CreateReviewForm from "../CreateReviewForm";
import './SpotDetail.css';


const SpotDetails = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    // extract the spotId from the parameter
    const { spotId } = useParams()
    // find userId from session state // type of data = number
    // question mark: optional chaining, checks to see if what before it exists
    // and if it doesn't it stops it from continuing on with the line
    const userId = useSelector(state => state.session.user?.id)
    // find ownerId from spot data // type of data = number
    const ownerId = useSelector(state => state.spots.singleSpot.ownerId)
    //spot selector
    const spot = useSelector(state => state.spots.singleSpot)
    //reviews selector // selecting a nested object, so our reducer must explicity create new memory reference to change state/cause re-render
    const reviewsObj = useSelector(state => state.reviews.spot)
    // turn list of review obj into an array to iterate
    const reviews = Object.values(reviewsObj)

    const existingReview = reviews.find(review => review.userId === userId)

    // Originally spot.SpotImages === undefined, can't use find method on undefined errors out
    // change reducer so that spot has an intial state with they key SpotImages: [],
    // Can use find method on empty array but will be undefined.
    const spotImageArray = spot.SpotImages

    const previewImage = spotImageArray.find(spot => spot.preview === true)

    let nonPreviewImages = spotImageArray.filter(spot => spot.preview === false)

    while (nonPreviewImages.length < 4) {
        nonPreviewImages.push({url: 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found-300x169.jpg'})
    }

    // if there are more than 4 images, take only the first four and display them on the right.
    if (nonPreviewImages.length > 4) {
        nonPreviewImages = nonPreviewImages.slice(0,4)
    }

    useEffect(() => {
        const getData = async() => {
            await dispatch(getOneSpot(spotId))
            await dispatch(getReviewsOfSpot(spotId))
        }
        getData();
    }, [dispatch, spotId])

    const deleteSpot = async (e) => {
        e.preventDefault()
        await dispatch(deleteASpot(spotId)).then(res => {
            const { message } = res
            alert(message)
        })

        history.push(`/`)
    }

    return (
        <div className="center-spot-container">
            <div className="spot-detail-main-container">
                <h1 className="name-of-spot">{spot.name}</h1>
                <div className="reviews-address-info">
                    <i className="fa-solid fa-star"></i>
                    <span className="avgrating-spotdetails-">
                        {reviews.length === 0 ? <span>No Ratings Yet</span> : spot?.avgStarRating}
                    </span>
                    <span className="dot-text">{"•"}</span>
                    <span className="numreview-spotdetails">
                        {reviews.length === 0 ? <span>No Reviews Yet</span> : <span>{spot?.numReview} reviews</span>}
                    </span>
                    <span className="dot-text">{"•"}</span>
                    <span className="address-spotdetails">{spot.city}, {spot.state}, {spot.country}</span>
                </div>
                <div className="spotdetail-image-main-container">
                    <div className="left-image-container">
                        <img
                            className="previewImage-spotdetail"
                            // add optional chaining because until useEffect fires previewImage === undefined, can't key into undefined
                            src={previewImage?.url}
                            alt="left-preview"
                        />
                    </div>
                    <div className="right-image-container">
                        {nonPreviewImages.map(image => (
                            <img
                                key={nonPreviewImages.indexOf(image)}
                                className="nonPreviewImage-spotdetail"
                                src={image?.url}
                                alt='right-preview'
                            />
                        ))}
                    </div>
                </div>
                {/* conditional render a modal if user is here */}
                {/* when passing a component must be Capitalized for react to know it is a component. */}
                <div className="edit-delete-container">
                    { userId === ownerId && <CustomModal className="edit-button" spot={spot} buttontext="Edit" Content={EditSpotForm}/>}
                    { userId === ownerId && <button className="delete-button-spot" onClick={deleteSpot}>Delete</button>}
                </div>
                <div className="description-main-container">
                    <h1>Description</h1>
                    {spot.description}
                </div>
                <div className="reviews-main-container">
                    <div className="review-and-button">
                        <h2>Total Reviews</h2>
                        <span className="write-review-button">
                            {/* conditionally render the create review */}
                            {!existingReview && (userId !== ownerId) && userId &&
                                <CustomModal className="review-button" buttontext="Write a Review" Content={CreateReviewForm} spotId={spotId}/>
                            }
                        </span>
                    </div>
                    <div className="star-rating-numberOfReviews">
                        <i className="fa-solid fa-star"></i>
                        <span className="avgrating-spotdetails-">
                            {reviews.length === 0 ? <span>No Ratings Yet</span> : spot?.avgStarRating}
                        </span>
                        <span className="dot-text">{"•"}</span>
                        <span className="numreview-spotdetails">
                            {reviews.length === 0 ? <span>No Reviews Yet</span> : <span>{spot?.numReview} reviews</span>}
                        </span>
                    </div>
                    <div className="reviews-container">
                        {reviews.map(review => (
                            <SpotReviews key={review.id} review={review} userId={userId}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpotDetails
