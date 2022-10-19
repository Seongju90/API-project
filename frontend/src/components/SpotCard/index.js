import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({spot}) => {

    return (
        <div className="image-links-container">
            <div className="image">
                <Link to={`/spots/${spot.id}`}>
                    <img
                        src={spot.previewImage}
                    />
                </Link>
            </div>
            <div>
                address / stars
            </div>
            <div>
                Other information
            </div>
        </div>
    );
}


export default SpotCard;
