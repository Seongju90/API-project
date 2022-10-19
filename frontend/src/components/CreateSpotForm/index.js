import { useDispatch } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { addImgToSpot, createASpot } from "../../store/spots"

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    // create states for input fields
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    //adding url for spotImg on creation
    const [url, setUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()

        // create a spot Obj to be in the newState
        const spot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price
        }

        // creating spotImg body to dispatch to thunk
        const spotImgBody = {
            url,
            "preview": true
        }

        // need await because waiting for response for newly created spot
        const newSpot = await dispatch(createASpot(spot))

        // if we did create the spot
        if (newSpot.id) {
            // dispatch the new spot and spotimg body to img thunk, afterwards redirect to newly created spot route
            dispatch(addImgToSpot(newSpot, spotImgBody)).then(history.push(`/spots/${newSpot.id}`))
        }
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
                <label>
                    Image url
                    <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
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

export default CreateSpotForm;
