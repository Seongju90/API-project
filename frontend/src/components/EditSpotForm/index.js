import { useDispatch} from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOneSpot, editASpot} from "../../store/spots"

import './EditSpot.css';

const EditSpotForm = ({setShowModal, spot}) => {
    const dispatch = useDispatch();

    // find the id of the spot from params
    const { spotId } = useParams();

    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
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

        // front-end spot validation
        if (!address.length) error.push("Street address is required")
        if (!city.length) error.push("City is required")
        if (!state.length) error.push("State is required")
        if (!country.length) error.push("Country is required")
        if (name.length > 50) error.push("Name must be less than 50 characters")
        if (!description.length) error.push("Description is required")
        // e.target.value is a string not a number
        if (price === "0" || !price) error.push("Price per day is required")

        // If I have any errors set them, otherwise edit the spot
        setErrors(error)
        if (error.length) return;

        // might need spot & spotId, error message showing undefined
        // make edit wait before executing the hide modal
        await dispatch(editASpot(spot, spotId)).catch(
            async (res) => {
                const data = await res.json();
                // console.log('data in catch', data)
                if (data && data.errors) setErrors(data.errors)
            }
        )

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
