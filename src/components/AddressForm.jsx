import React, { useState } from 'react'
import './AddressForm.css'

const AddressForm = ({ onSubmit }) => {
  const [address, setAddress] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!address.trim()) {
      setIsValid(false)
      return
    }
    
    setIsValid(true)
    onSubmit(address.trim())
  }

  const handleInputChange = (e) => {
    setAddress(e.target.value)
    if (e.target.value.trim()) {
      setIsValid(true)
    }
  }

  return (
    <div className="address-form-container">
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Enter an address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleInputChange}
            placeholder="e.g., 123 Main St, New York, NY"
            className={`form-input ${!isValid ? 'error' : ''}`}
            required
          />
          {!isValid && (
            <span className="error-message">Please enter a valid address</span>
          )}
        </div>
        
        <button type="submit" className="submit-btn">
          🔍 Find News
        </button>
      </form>
      
      <div className="form-examples">
        <p className="examples-title">Example addresses:</p>
        <div className="example-buttons">
          <button 
            type="button" 
            className="example-btn"
            onClick={() => onSubmit('1600 Pennsylvania Avenue, Washington, DC')}
          >
            Washington, DC
          </button>
          <button 
            type="button" 
            className="example-btn"
            onClick={() => onSubmit('1 Apple Park Way, Cupertino, CA')}
          >
            Cupertino, CA
          </button>
          <button 
            type="button" 
            className="example-btn"
            onClick={() => onSubmit('350 Fifth Avenue, New York, NY')}
          >
            New York, NY
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
