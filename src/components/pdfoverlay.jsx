import React, { useState } from 'react'

const sharedClasses = {
  button: 'bg-blue-500 text-white px-4 py-2 rounded',
  input: 'border border-zinc-300 p-2 rounded w-full',
  label: 'block text-zinc-700 dark:text-zinc-300 mb-2',
}

const PdfOverlay = () => {
  const [photos, setPhotos] = useState([])

  const handlePhotoChange = (event) => {
    setPhotos([...event.target.files])
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
        
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">PDF Overlay</h1>
        </div>
        
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Address" className={sharedClasses.input} />
          <input type="text" placeholder="Age of Home" className={sharedClasses.input} />
          <input type="text" placeholder="Roof Age" className={sharedClasses.input} />
          <input type="text" placeholder="Client Name Present" className={sharedClasses.input} />
          <input type="text" placeholder="Roof Covering" className={sharedClasses.input} />
          <input type="text" placeholder="Water Service" className={sharedClasses.input} />
          <input type="text" placeholder="Roof Slope" className={sharedClasses.input} />
        </div>
        <div>
          <label className={sharedClasses.label}>Check all that apply</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" name="apply" className="mr-2" /> None
            </label>
            <label className="flex items-center">
              <input type="radio" name="apply" className="mr-2" /> All
            </label>
            <label className="flex items-center">
              <input type="radio" name="apply" className="mr-2" /> Some
            </label>
            <label className="flex items-center">
              <input type="radio" name="apply" className="mr-2" /> Many
            </label>
          </div>
        </div>
        <div>
          <label className={sharedClasses.label}>Describe conditions</label>
          <textarea className="border border-zinc-300 p-2 rounded w-full h-32"></textarea>
        </div>
        <div>
          <label className={sharedClasses.label}><b>Add Photos</b></label>
          <input
            type="file"
            multiple
            className={sharedClasses.input}
            onChange={handlePhotoChange}
          />
        </div>
      </form>
    </div>
  )
}

export default PdfOverlay
