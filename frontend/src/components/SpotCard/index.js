import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({spot}) => {

    return (
        <div className="image-links-container">
            <Link className="img-link" to={`/spots/${spot.id}`}>
                <img
                    className="spot-card-img"
                    src={spot.previewImage}
                />
            </Link>
            <div className="address">
                address / stars
            </div>
            <div className="other-info">
                Other information
            </div>
        </div>
    );
}


export default SpotCard;
