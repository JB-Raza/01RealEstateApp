import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function AddListing() {

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [services, setServices] = useState([])
  const [serviceInput, setServiceInput] = useState("")
  const [images, setImages] = useState([])
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.currentUser)

  const [imgPreviews, setImgPreviews] = useState([])

  // images.map((image) => {
  //   const file = image
  //   const reader = new FileReader()
  //   reader.onload = () =>{
  //     setImgPreviews([ ...imgPreviews, reader.result ])
  //   }
  //   reader.readAsDataURL(file)
  // })

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
    };

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
    setServices([
      ...services,
      serviceInput
    ])
    setServiceInput("")
  }

  const handleRemoveService = (index) => {
    setServices(services.filter((service, i) => i !== index))
  }

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      // Validate required fields
      if (!formData.title || !formData.price || images.length === 0) {
        return alert("Please fill out all required fields and upload images.");
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("type", formData.category);
      form.append("service", formData.rentOrSale);
      form.append("address", formData.address);
      form.append("price", formData.price);
      form.append("discountedPrice", formData.discountedPrice);
      form.append("contact", formData.contact);

      // append services
      services.forEach(service => {
        form.append("services", service)
      })
      // Append multiple images
      images.forEach((image) => {
        form.append("images", image);
      });

      const res = await fetch("/api/listings/add", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/")
        alert("Listing added successfully!");
      } else {
        console.error("Error response:", data);
        alert(data.message || "Failed to add listing.");
      }
      setLoading(false)
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
      setLoading(false)
    }
  };

  return !user ? <Navigate to="/signin" /> : (
    <div className='max-w-4xl m-auto'>
      <h1 className='text-center my-6 text-xl md:text-3xl text-slate-700 font-bold'>Create a New Listing</h1>

      <form
        onSubmit={handleFormSubmit}
        className='flex justify-center items-center flex-col md:flex-row md:items-start md: gap-3 px-4'>
        {/* col 1 rest of form */}
        <div className='first flex-1 '>
          {/* title */}
          <input type="text" placeholder='Title' name='title' id='title'
            className='input-box focus:scale-100 invalid:border-red-400'
            maxLength={50} minLength={10} required
            onChange={handleInputChange}
          />
          {/* description */}
          <textarea name="description" id="description" placeholder='Description'
            className='input-box focus:scale-100 invalid:border-red-400'
            minLength={10} required
            onChange={handleInputChange}
          ></textarea>
          {/* category rent or sale */}
          <div className='flex gap-2'>
            {/* category */}
            <select name="category" id="category" required className='input-box focus:scale-100 invalid:border-red-400'
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            // defaultValue={"rent"}
            >
              <option value="select">select</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
          {/* address */}
          <input type="text" placeholder='Address' name='address' id='address' className='input-box focus:scale-100 invalid:border-red-400'
            maxLength={75} minLength={10} required
            onChange={handleInputChange}
          />
          {/* price and discount */}
          <div className='flex gap-2'>
            {/* price */}
            <input type="number" placeholder='Price' name='price' id='price' className='input-box focus:scale-100 invalid:border-red-400'
              required onChange={handleInputChange}
            />
            {/* discounted price */}
            <input type="number" placeholder='Discount' name='discountedPrice' id='discountedPrice'
              className='input-box focus:scale-100 invalid:border-red-400'
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* col 2 contact, images and services*/}
        <div className='second flex-1'>
          {/* contact */}
          <input type="number" placeholder='Contact No.' name='contact' id='contact' className='input-box focus:scale-100 invalid:border-red-400'
            required
            onChange={handleInputChange} />

          {/* Services */}
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
            accept="image/*" required multiple onChange={handleImgChange} />

          {/* selected images previews */}
          <div className="flex flex-wrap gap-2 flex-col rounded-md mt-2 mb-4">
            {imgPreviews.map((preview, index) => (
              <div key={index} className='flex items-center justify-between px-1 py-1 border-4 rounded-md'>
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 object-cover rounded-md border"
                />
                <FontAwesomeIcon onClick={() => setImages(images.filter((image, i) => i != index))} icon={faTrash} className='w-16 cursor-pointer text-red-600 hover:text-red-800' />
              </div>
            ))}
          </div>

          {/* submit button */}
          <button
            disabled={loading}
            className='disabled:opacity-75 text-white rounded-md py-3 text-lg font-semibold cursor-pointer w-full bg-slate-700 hover:bg-slate-800 outline-none'
          >{loading ? "loading..." : "Create Listing"}</button>
        </div>
      </form>
    </div>
  )
}

export default AddListing
