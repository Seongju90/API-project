import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SpotCard = ({spot}) => {

useEffect(() => {
    console.log('spotCard', spot)
})
    return (
        <div>
            <Link to={`/spots/${spot.id}`}>Image Link</Link>
        </div>
    );
}


export default SpotCard;
