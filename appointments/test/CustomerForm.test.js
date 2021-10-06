import React from 'react';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import ReactTestUtils from 'react-dom/test-utils';


describe('CustomerForm', () => {
   let render, container;
   beforeEach(() => {
      ({ render, container } = createContainer());
   });

   const form = id => container.querySelector(`form[id="${id}"]`);
   const field = name => form('customer').elements[name];
   const labelFor = formElement =>
      container.querySelector(`label[for="${formElement}"]`);

   const expectToBeInputFieldOfTypeText = formElement => {
      expect(formElement).not.toBeNull();
      expect(formElement.tagName).toEqual('INPUT');
      expect(formElement.type).toEqual('text');
   };

   const itIncludesTheExistingValue = (fieldName, value) =>
      it('includes the existing value', () => {
         render(<CustomerForm {...{ [fieldName]: value }} />);
         expect(field(fieldName).value).toEqual(value);
      });

   const itRendersAsATextBox = (fieldName) =>
      it('renders as a text box', () => {
         render(<CustomerForm />);
         expectToBeInputFieldOfTypeText(field(fieldName));
      });

   const itRendersAlabel = (labelName, value) => {
      it('renders a label for the  field', () => {
         render(<CustomerForm />)
         expect(labelFor(labelName).textContent).toEqual(value)
      })
   }

   const itAssignsLabelThatMatchesIdField = (fieldName, value) => {
      it('label htmlFor value matches  id field', () => {
         render(<CustomerForm />);
         expect(field(fieldName).id).toEqual(value)
      })
   }

   const itSubmitsExistingValue = (fieldName, value) => {
      it('save existing value when submitted', async () => {
         expect.hasAssertions();
         render(
            <CustomerForm
               {...{ [fieldName]: value }}
               onSubmit={props =>
                  expect(props[fieldName]).toEqual(value)
               }
            />
         )

         await ReactTestUtils.Simulate.submit(form('customer'));
      })

   }

   const itSubmitsNewValue = (fieldName, value) => {
      it('saves new value when submitted', async () => {
         expect.hasAssertions();
         render(
            <CustomerForm
               {...{ [fieldName]: 'existingValue' }}
               onSubmit={props =>
                  expect(props[fieldName]).toEqual(value)
               }
            />
         );
         await ReactTestUtils.Simulate.change(field(fieldName), {
            target: { value, name: fieldName }
         });
         await ReactTestUtils.Simulate.submit(form('customer'));
      });
   }

   it('renders a form', () => {
      render(<CustomerForm />);
      expect(form('customer')).not.toBeNull();

   })

   describe('first name field', () => {
      itRendersAsATextBox('firstName');
      itIncludesTheExistingValue('firstName', 'value');
      itRendersAlabel('firstName', 'First name');
      itAssignsLabelThatMatchesIdField('firstName', 'firstName')
      itSubmitsExistingValue('firstName', 'firstName');
      itSubmitsNewValue('firstName', 'anotherFirstName');
   })

   describe('last name field', () => {
      itRendersAsATextBox('lastName');
      itIncludesTheExistingValue('lastName', 'value');
      itRendersAlabel('lastName', 'Last name');
      itAssignsLabelThatMatchesIdField('lastName', 'lastName');
      itSubmitsExistingValue('lastName', 'lastName');
      itSubmitsNewValue('lastName', 'newValue');
   })

   describe('phone number field', () => {
      itRendersAsATextBox('phoneNumber');
      itIncludesTheExistingValue('phoneNumber', '084342');
      itRendersAlabel('phoneNumber', 'Phone number');
      itAssignsLabelThatMatchesIdField('phoneNumber', 'phoneNumber');
      itSubmitsExistingValue('phoneNumber', 'phoneNumber');
      itSubmitsNewValue('phoneNumber', '437289');
   })

   it('has a submit button', () => {
      render(<CustomerForm />);
      const btn = container.querySelector('input[type="submit"]');
      expect(btn).not.toBeNull()
   })


});
