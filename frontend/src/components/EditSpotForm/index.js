import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOneSpot, editASpot } from "../../store/spots"

const EditSpotForm = ({setShowModal}) => {
    const dispatch = useDispatch();

    // find the id of the spot from params
    const { spotId } = useParams();

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // load the current spot with id from params
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([]);

        // edit spot Obj to be in the newState
        const spot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price
        }

        // might need spot & spotId, error message showing undefined
        // make edit wait before executing the hide modal
        await dispatch(editASpot(spot, spotId)).catch(
            async (res) => {
                const data = await res.json();
                console.log('data in catch', data)
                if (data && data.errors) setErrors(data.errors)
            }
        )
        // hide modal after edit
        setShowModal(false)
    }
        return (
            <form onSubmit={handleSubmit}>
                <h1>Edit a Spot</h1>
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
                <button
                    type="submit"
                >
                    Submit
                </button>
            </form>
        );
    }

export default EditSpotForm;
