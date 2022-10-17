import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotCard from '../SpotCard'

const SpotBrowser = () => {
    const dispatch = useDispatch()
    // state has key spot with normalized array
    const spotObj = useSelector(state => state.spot)
    // turn normalized data into Array to use map
    const spots = Object.values(spotObj)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    // Each image of spot, will redirect to SpotCard
    return (
        <div>
            {spots.forEach(spot => (
                <SpotCard key={spot.id} spot={spot}/>
            ))}
        </div>
    );
}
export default SpotBrowser
