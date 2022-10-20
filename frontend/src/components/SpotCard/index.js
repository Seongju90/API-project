import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({spot}) => {

// extract address, price, and review from prop
const { address, price, avgRating } = spot;

    return (
        <div className="image-links-container">
            <Link className="img-link" to={`/spots/${spot.id}`}>
                <img
                    className="spot-card-img"
                    src={spot.previewImage}
                />
            </Link>
            <div className="spot-info-container">
                <span className="address">{address}</span>
                <span className="ratings">{avgRating}</span>
                <div className="other-info">{price}</div>
            </div>
        </div>
    );
}


export default SpotCard;
