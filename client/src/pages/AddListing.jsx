import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useMatch } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// states
import { useSelector, useDispatch } from 'react-redux'
import {setNotification} from '../redux/notificationSlice.js'

// components
import {Alert, Loader} from '../components/index.js';


function AddListing() {

  // all states
  const [isListingEditable, setIsListingEditable] = useState(false)
  const [editableListing, setEditableListing] = useState({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [services, setServices] = useState([])
  const [images, setImages] = useState([])
  const [imgPreviews, setImgPreviews] = useState([])
  const [serviceInput, setServiceInput] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.currentUser)
  const match = useMatch("/listings/:id/update") // checking if this is the current path or not

  // checking if route matches, fetching the listing and assigning the values to states
  useEffect(() => {
    if (match) {
      setIsListingEditable(true)
      const listingId = match.params.id

      const getListing = async () => {
        try {
          const res = await fetch(`/api/listings/${listingId}`)
          const listing = await res.json()
          setEditableListing(listing)

          const urlToFile = async (url, filename) => {
            const res = await fetch(url)
            const blob = await res.blob()
            // creating file
            return new File([blob], filename, { type: blob.type })
          }

          setImages([])
          // const newImgs = []
          const result = await Promise.allSettled(listing.images.map((imgUrl, index) => urlToFile(imgUrl, `${index}img.jpg`)))
          const newImgs = result
            .filter((result) => result.status === 'fulfilled' && result.value !== null)
            .map((result) => result.value)
          setImages(newImgs)

          // setting values in state
          setServices(listing.services)
          const { images, services, ...rest } = listing
          setFormData(rest)

        } catch (error) {
          console.log("ERROR: in setting values in formData : ", error)
        }
      }
      getListing()

    } else setIsListingEditable(false)
  }, [match])

  // generate image previews  
  useEffect(() => {
    const generatePreviews = async () => {
      const previews = await Promise.all(
        images.map((image) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(image);
          });
        })
      );
      setImgPreviews(previews);
    }
    if (images.length) {
      generatePreviews();
    }
  }, [images]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleAddService = () => {
    if (serviceInput.length > 0) {
      setServices([
        ...services,
        serviceInput
      ])
    }

    setServiceInput("")
  }

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("rentOrSale", formData.rentOrSale);
      form.append("address", formData.address);
      form.append("price", formData.price);
      form.append("discount", formData.discount);
      form.append("contact", formData.contact);

      // append services
      services.forEach(service => form.append("services", service) )
      // Append multiple images
      images.forEach((image) => form.append("images", image) )

      if(services.length === 0){
        dispatch(setNotification({type: "failure", message: "Please add at least one service"}))
        setLoading(false)
        return
      }
      if(images.length === 0){
        dispatch(setNotification({type: "failure", message: "Please add at least one image"}))
        setLoading(false)
        return
      }
      // update listing
      if (isListingEditable) {
        const res = await fetch(`/api/listings/${match.params.id}/update`, {
          method: "PUT",
          body: form
        })
        const data = await res.json()
        if (data.success) {
          navigate("/")
          dispatch(setNotification({type: "success", message: data.message}))
          setLoading(false)
          return
        }
        dispatch(setNotification({type: "failure", message: `ERROR in updating: ${data.message}`}))
        setLoading(false)
        return
      }
      // create listing
      else {
        const res = await fetch("/api/listings/add", {
          method: "POST",
          body: form,
        })
        const data = await res.json();
        if (data.success) {
          navigate("/")
          dispatch(setNotification({type: "success", message: "Listing created successfully"}))
        }
        else{
          dispatch(setNotification({type: "failure", message: `ERROR: ${data.message}`}))
        }
      }
      setLoading(false)
    } catch (error) {
      dispatch(setNotification({type: "failure", message: `ERROR: ${error.message}`}))
      setLoading(false)
    }
  };

  if(!editableListing.images){
    return <Loader />
  }
  return !user ? <Navigate to="/signin" /> : (
    <div className='max-w-4xl m-auto'>
      <Alert />
      <h1 className='text-center my-6 text-xl md:text-3xl text-slate-700 font-bold'>{isListingEditable? "Update Listing" : "Create a New Listing"}</h1>
      <form
        onSubmit={handleFormSubmit}
        className='flex justify-center items-center flex-col md:flex-row md:items-start md: gap-3 px-4'>

        {/* col 1 rest of form */}
        <div className='first flex-1 '>
          {/* title */}
          <input type="text" placeholder='Title' name='title' id='title'
            className='input-box focus:scale-100 invalid:border-red-400'
            value={formData.title || ""} maxLength={50} minLength={10} required
            onChange={handleInputChange}
          />
          {/* description */}
          <textarea name="description" id="description" placeholder='Description'
            className='input-box focus:scale-100 invalid:border-red-400'
            value={formData.description || ""} minLength={10} rows={4} required
            onChange={handleInputChange}
          ></textarea>
          {/* category and rent or sale */}
          <div className='flex gap-2'>
            {/* category */}
            <select name="category" id="category" required className='input-box focus:scale-100 invalid:border-red-400'
              value={formData.category || ""} onChange={handleInputChange}
            >
              <option value="select">select</option>
              <option value="Standard">Standard</option>
              <option value="Villa">Villa</option>
              <option value="Mansion">Mansion</option>
              <option value="Cottage">Cottage</option>
              <option value="Palace">Palace</option>
            </select>
            {/* rentOrSale */}
            <select name="rentOrSale" id="rentOrSale" required className='input-box focus:scale-100 invalid:border-red-400'
              value={formData.rentOrSale || ""} onChange={handleInputChange}
            >
              <option value="select">select</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
          {/* address */}
          <input type="text" placeholder='Address' name='address' id='address' className='input-box focus:scale-100 invalid:border-red-400'
            value={formData.address || ""} maxLength={75} minLength={10} required
            onChange={handleInputChange}
          />
          {/* price and discount */}
          <div className='flex gap-2'>
            {/* price */}
            <input type="number" placeholder='Price' name='price' id='price'
              className='input-box focus:scale-100 invalid:border-red-400'
              value={formData.price || ""} required onChange={handleInputChange}
            />
            {/* discounted price */}
            <input type="number" placeholder='Discount' name='discount' id='discount'
              className='input-box focus:scale-100 invalid:border-red-400'
              value={formData.discount || ""} onChange={handleInputChange}
            />
          </div>
        </div>

        {/* col 2 contact, images and services*/}
        <div className='second flex-1'>
          {/* contact */}
          <input type="number" placeholder='Contact No.' name='contact' id='contact' className='input-box focus:scale-100 invalid:border-red-400'
            required value={formData.contact || ""} onChange={handleInputChange} />

          {/* add service */}
          <div className="services-input flex items-center">
            <input
              type="text"
              placeholder="Add Service"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              className="input-box focus:scale-100 !rounded-r-none invalid:border-red-400"
            />
            <button
              type="button"
              onClick={handleAddService}
              className="mx-0 bg-slate-600 hover:bg-slate-700 outline-none text-white px-3 py-3 rounded-r-md"
            >
              Add
            </button>
          </div>

          {/* Display Services */}
          <ul className="mt-2 flex flex-wrap gap-2">
            {services && services.map((service, index) => (
              <li key={index} className="flex items-center mx-1 p-2 font-bold rounded-md bg-slate-300">
                <span className="mr-2">{service}</span>

                {/* del btn */}
                <FontAwesomeIcon icon={faTrash} type='button'
                  className='text-red-500 cursor-pointer'
                  onClick={() => setServices(services.filter((service, i) => i !== index))} />
              </li>
            ))}
          </ul>


          <p className='text-xs mt-4 mb-0 text-gray-600'> <b>Images:</b> The first Image will be the Cover (max 4) </p>
          {/* select images */}
          <input type="file" name='images' id='images' className='input-box focus:scale-100  invalid:border-red-400'
            accept="image/*" multiple onChange={handleImgChange} />

          {/* selected images previews */}
          <div className="flex flex-wrap gap-2 flex-col rounded-md mt-2 mb-4">
            {imgPreviews.map((preview, index) => (
              <div key={index} className='flex items-center justify-between px-1 py-1 border-4 rounded-md'>
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 object-cover rounded-md border"
                />
                <FontAwesomeIcon
                  onClick={() => setImages(images.filter((image, i) => i != index))}
                  icon={faTrash} className='w-16 cursor-pointer text-red-600 hover:text-red-800' />
              </div>
            ))}
          </div>

          {/* submit button */}
          <button
            disabled={loading}
            className='disabled:opacity-75 text-white rounded-md py-3 text-lg font-semibold cursor-pointer w-full bg-slate-700 hover:bg-slate-800 outline-none'
          >{loading ? "loading..." : <span>{isListingEditable ? "Update Listing" : "Create Listing"}</span>}</button>
        </div>
      </form>
    </div>
  )
}

export default AddListing
