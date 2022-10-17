import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { editASpot } from "../../store/spots"

const EditSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    // find the id of the spot from params
    const { spotId } = useParams();
    console.log(spotId)
    // find the spot with the Id from params
    const findSpot = useSelector(state => console.log(state))

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()

        // create a spot Obj to be in the newState
        const spot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }

        // use the response from thunk to get the ID of newly created spot
        dispatch(editASpot(spot)).then(res => {
            // console.log('responseid', res.id)
            //redirect to spot ID page after creating it
            history.push(`/spots/${res.id}`)
        })
    }
        return (
            <form onSubmit={handleSubmit}>
                <h1>Create a Spot</h1>
                <label>
                    Address
                    <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    />
                </label>
                <label>
                    City
                    <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    />
                </label>
                <label>
                    State
                    <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    />
                </label>
                <label>
                    Country
                    <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    />
                </label>
                <label>
                    Latitude
                    <input
                    type="number"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    />
                </label>
                <label>
                    Longitude
                    <input
                    type="number"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    />
                </label>
                <label>
                    Name
                    <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                </label>
                <label>
                    Description
                    <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    Price
                    <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    />
                </label>
                <button
                    type="submit"
                >
                    Submit
                </button>
            </form>
        );
    }

export default EditSpotForm;
