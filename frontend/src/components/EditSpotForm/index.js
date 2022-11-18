import { useDispatch} from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getOneSpot, editASpot, addImgToSpot } from "../../store/spots"

import './EditSpot.css';

const EditSpotForm = ({setShowModal}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    // find the id of the spot from params
    const { spotId } = useParams();

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState([]);


    useEffect(() => {
        // load the current spot with id from params
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    const handleSubmit = async (e) => {

        e.preventDefault()
        const error = [];

        // edit spot Obj to be in the newState
        const spot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price,
        }

        // creating spotImg body to dispatch to thunk
        const spotImgBody = {
            url,
            "preview": true
        }

        // front-end spot validation
        if (!address.length) error.push("Street address is required")
        if (!city.length) error.push("City is required")
        if (!state.length) error.push("State is required")
        if (!country.length) error.push("Country is required")
        if (name.length > 50) error.push("Name must be less than 50 characters")
        if (!description.length) error.push("Description is required")
        // e.target.value is a string not a number
        if (price === "0" || !price) error.push("Price per day is required")

        // check if url is an image or not
        const splitUrl = url.split(".")
        const validImageTypes = ["png", "jpeg", "jpg"]
        // some() tests whether at least one element in the array passes the test implemented by the provided function.
        const validUrl = splitUrl.some(urlString => validImageTypes.includes(urlString))

        if (!validUrl) {
            error.push("Images must be png, jpeg, or jpg format")
        }

        // If I have any errors set them, otherwise edit the spot
        setErrors(error)
        if (error.length) return;

        // might need spot & spotId, error message showing undefined
        // make edit wait before executing the hide modal
        const edittedSpot = await dispatch(editASpot(spot, spotId)).catch(
            async (res) => {
                const data = await res.json();
                // console.log('data in catch', data)
                if (data && data.errors) setErrors(data.errors)
            }
        )

        if(edittedSpot.id) {
            dispatch(addImgToSpot(edittedSpot, spotImgBody))
            .then(history.push(`/spots/${spotId}`))
        }

        // hide modal after edit
        setShowModal(false)
    }
        return (
            <form className="edit-spot-main-container" onSubmit={handleSubmit}>
                <h1>Edit a Spot</h1>
                <div className="edit-spot-detail-container">
                    <ul>
                        {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <div className="editspot">
                        <label className="label">
                            Address
                            <input
                            className="input"
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            City
                            <input
                            className="input"
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            State
                            <input
                            className="input"
                            type="text"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            Country
                            <input className="input"
                            type="text"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            Name
                            <input className="input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            Description
                            <input className="input"
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            Price
                            <input className="input"
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="editspot">
                        <label className="label">
                            Image url
                            <input className="input"
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <button
                    className="edit-button"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        );
    }

export default EditSpotForm;
