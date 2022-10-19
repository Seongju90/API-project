import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotCard from '../SpotCard'
import './Spot.css';

const SpotBrowser = () => {
    const dispatch = useDispatch()
    // state has key spot with normalized array
    const spotObj = useSelector(state => state.spots.allSpots)
    // turn normalized data into Array to use map
    const spots = Object.values(spotObj)
    // console.log('home', spots)
    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    // Each image of spot, will redirect to SpotCard
    return (
        <div className="main-parent-container">
            <div className="spot-card-container">
                    {spots.map(spot => (
                        <SpotCard key={spot.id} spot={spot}/>
                    ))}
            </div>
        </div>
    );
}
export default SpotBrowser
