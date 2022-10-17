import { Link } from 'react-router-dom';

const SpotCard = ({spot}) => {

// console.log('spotCard', spot)

    return (
        <div>
            <Link to={`/spots/${spot.id}`}>{spot.previewImage}</Link>
        </div>
    );
}


export default SpotCard;
