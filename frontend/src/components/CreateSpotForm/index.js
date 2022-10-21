import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
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
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const error = [];
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

        //front-end spot validation
        if (!address.length) error.push("Street address is required")
        if (!city.length) error.push("City is required")
        if (!state.length) error.push("State is required")
        if (!country.length) error.push("Country is required")
        if (name.length > 50) error.push("Name must be less than 50 characters")
        if (!description.length) error.push("Description is required")
        // e.target.value is a string not a number
        if (price === "0" || !price) error.push("Price per day is required")
        if (!url.length) error.push("Image url required")
        // check if url is an image or not
        const splitUrl = url.split(".")
        const validImageTypes = ["png", "jpeg", "jpg"]
        // some() tests whether at least one element in the array passes the test implemented by the provided function.
        const validUrl = splitUrl.some(urlString => validImageTypes.includes(urlString))

        if (!validUrl) {
            error.push("Images must be png, jpeg, or jpg format")
        }

        // If I have any errors set them, otherwise create a new spot
        setErrors(error)

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
                <ul>
                    {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                    ))}
                </ul>
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
