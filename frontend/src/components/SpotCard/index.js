import { Link } from 'react-router-dom';
import './SpotCard.css';
import Star from "../SVG/star"

const SpotCard = ({spot}) => {

// extract address, price, and review from prop
const { address, price, avgRating } = spot;

    return (
        <div className="image-links-container">
            <Link className="img-link" to={`/spots/${spot.id}`}>
                <img
                    className="spot-card-img"
                    src={spot.previewImage}
                    alt="images-of-spots"
                />
            </Link>
            <div className="spot-info-container">
                <div className="address-star-rating-container">
                    <div className="address">{address}</div>
                    <Star/>
                    <div className="ratings">{avgRating}</div>
                </div>
                <div className="other-info">{`$${price}`}</div>
            </div>
        </div>
    );
}


export default SpotCard;
