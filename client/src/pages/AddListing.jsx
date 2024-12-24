import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
function AddListing() {

  const [formData, setFormData] = useState({})
  const [images, setImages] = useState([])

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleImgChange = (e) => {
    const files = Array.from(e.target.files)
    // const files = e.target.files
    setImages(files)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title || !formData.price || images.length === 0) {
        return alert("Please fill out all required fields and upload images.");
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("type", formData.type);
      form.append("service", formData.service);
      form.append("address", formData.address);
      form.append("price", formData.price);
      form.append("discountedPrice", formData.discountedPrice);
      form.append("contact", formData.contact);
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
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };


  return (
    <div>
      <h1 className='text-center my-6 text-xl md:text-3xl font-bold'>Create a New Listing</h1>

      <form
        onSubmit={handleFormSubmit}
        className='max-w-4xl m-auto flex justify-center items-center flex-col md:flex-row md:items-start md: gap-3'>
        {/* col 1 rest of form */}
        <div className='first w-2/3'>
          {/* title */}
          <input type="text" placeholder='Title' name='title' id='title' className='input-box focus:scale-100'
            onChange={handleInputChange}
          />
          {/* description */}
          <textarea name="description" id="description" className='input-box focus:scale-100' placeholder='Description'
            onChange={handleInputChange}
          ></textarea>
          <div className='flex gap-2'>
            {/* type */}
            <select name="type" id="type" className='input-box focus:scale-100'
              onChange={handleInputChange}
            >
              <option value="select">select</option>
              <option value="Standard">Standard</option>
              <option value="Villa">Villa</option>
              <option value="Mansion">Mansion</option>
              <option value="Cottage">Cottage</option>
              <option value="Furnished">Furnished</option>
              <option value="Palace">Palace</option>
            </select>

            <select name="service" id="service" className='input-box focus:scale-100'
              onChange={handleInputChange}
              // defaultValue={"rent"}
            >
              <option value="select">select</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
          {/* address */}
          <input type="text" placeholder='Address' name='address' id='address' className='input-box focus:scale-100'
            onChange={handleInputChange}
          />
          <div className='flex gap-2'>
            {/* price */}
            <input type="number" placeholder='Price' name='price' id='price' className='input-box focus:scale-100'
              onChange={handleInputChange}
            />
            {/* discounted price */}
            <input type="number" placeholder='Discounted Price' name='discountedPrice' id='discountedPrice' className='input-box focus:scale-100'
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* col 2 contact and images */}
        <div className='second w-2/3 md:w-1/3'>
          {/* contact */}
          <input type="number" placeholder='Contact No.' name='contact' id='contact' className='input-box focus:scale-100'
            onChange={handleInputChange}
          />
          <p className='text-sm text-gray-600'> <b>Images:</b> The first Image will be the Cover (max 4) </p>
          {/* image */}
          <input type="file" name='images' id='images' className='input-box focus:scale-100 ' accept="image/*" multiple
            onChange={handleImgChange} />
          <button className='text-white rounded-md py-3 text-lg font-semibold cursor-pointer w-full bg-slate-700 hover:bg-slate-800 outline-none'>Create Listing</button>
        </div>
      </form>
    </div>
  )
}

export default AddListing
