import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllSpots } from '../../store/spots';

const SpotBrowser = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())

    }, [dispatch])

    return (
        <div>

        </div>
    );
}
export default SpotBrowser
