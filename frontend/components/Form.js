import React, { useEffect, useState } from 'react'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup.string().trim().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong),
  size: yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
})


// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {

  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: []
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    size: '',
  });

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [successMessage, setSuccessMessage] = useState('');

  const [failMessage, setFailMessage] = useState('');

  useEffect(() => {
    console.log('Form Data:', formData);
    formSchema.isValid(formData).then(valid => setSubmitDisabled(!valid))
  }, [formData]);


  const validate = (name, value) => {
    // const errorMessage = name === 'size' ? validationErrors : 
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' })))
      .catch(err => {
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: err.errors[0] }));
      })
  };


  const onChange = evt => {
    const { type, name, value, checked } = evt.target;
    // console.log('type', type)

    if (type === 'checkbox') {
      let updatedToppings;
      console.log('value', value)

      if (checked) {
        // Add the topping to the array if checked
        updatedToppings = [...formData.toppings, value];
      } else {

        // Remove the topping from the array if unchecked
        updatedToppings = formData.toppings.filter(topping => topping !== value);
      }

      setFormData({ ...formData, toppings: updatedToppings });
    } else if (type === 'select-one') {
      setFormData({ ...formData, [name]: value });

      // Call validate function for the changed input field
      validate(name, value);
    } else {
      setFormData({ ...formData, [name]: value });

      // Call validate function for the changed input field
      validate(name, value);
    }
  };

  const onSubmit = evt => {
    evt.preventDefault()
    const toppingMessage = formData.toppings.length == 0 ? 'no toppings' : formData.toppings.length == 1 ? '1 topping' : `${formData.toppings.length} toppings`
    const size = formData.size === 'S' ? 'small' : formData.size === 'M' ? 'medium' : 'large'

    setSuccessMessage(`Thank you for your order, ${formData.fullName}! Your ${size} pizza with ${toppingMessage} is on the way. `)

    setFormData({
      fullName: '',
      size: '',
      toppings: []
    })
  }


  return (

    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
      {failMessage && <div className='failure'>{failMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={formData.fullName} placeholder="Type full name" id="fullName" type="text" name='fullName' onChange={onChange} />
        </div>
        {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select name='size' id="size" value={formData.size} onChange={onChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {formErrors.size && <div className='error'>{formErrors.size}</div>}
      </div>

      {/* 👇 Maybe you could generate the checkboxes dynamically */}
      <div className="input-group">

        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input type='checkbox' checked={formData.toppings.includes(topping.text)} value={topping.text} onChange={onChange} />
            {topping.text}<br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={submitDisabled} />
    </form>
  )
}