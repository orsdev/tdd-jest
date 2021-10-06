import React, { useState } from 'react';

export const CustomerForm = ({ firstName, lastName, phoneNumber, onSubmit }) => {
   const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });

   const handleChange = ({ target }) =>
      setCustomer(customer => ({
         ...customer,
         [target.name]: target.value
      }));


   return (
      <form
         id="customer"
         onSubmit={() => onSubmit(customer)}>
         <div>
            <label htmlFor="firstName">First name</label>
            <input
               type="text"
               name="firstName"
               id="firstName"
               value={customer.firstName}
               onChange={handleChange}
               readOnly
            />
         </div>
         <div>
            <label htmlFor="lastName">Last name</label>
            <input
               type="text"
               name="lastName"
               id="lastName"
               value={customer.lastName}
               onChange={handleChange}
               readOnly
            />
         </div>
         <div>
            <label htmlFor="phoneNumber">Phone number</label>
            <input
               type="text"
               name="phoneNumber"
               id="phoneNumber"
               value={customer.phoneNumber}
               onChange={handleChange}
               readOnly
            />
         </div>
         <input type="submit" value="Add" />
      </form>
   )
};