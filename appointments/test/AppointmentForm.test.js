import React from 'react';
import { createContainer } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';
import ReactTestUtils from 'react-dom/test-utils';

describe('AppointmentForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  })

  const form = id =>
    container.querySelector(`form[id="${id}"]`);
  const field = (name) => form('appointment').elements[name];
  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      option => option.textContent === textContent
    );
  };
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const timeSlotTable = () =>
    container.querySelector('table#time-slots');

  const startsAtField = index =>
    container.querySelectorAll(`input[name="startsAt"]`)[
    index
    ];



  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  })

  describe('service field', () => {
    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field('service'))
        .not.toBeNull();
      expect(field('service').tagName)
        .toEqual('SELECT');
    })

    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field('service').childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    })

    it('lists all salon services', () => {
      const selectableServices = [
        'Cut',
        'Blow-dry'];
      render(<AppointmentForm
        selectableServices={selectableServices} />);
      const optionNodes = Array.from(
        field('service').childNodes
      );
      const renderedServices = optionNodes.map(
        node => node.textContent
      );
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      )
    })

    it('pre-selects the existing value', () => {
      const services = ['Cut', 'Blow-dry'];
      render(
        <AppointmentForm
          selectableServices={services}
          service="Blow-dry"
        />
      )

      const option = findOption(
        field('service'),
        'Blow-dry'
      );
      expect(option.selected).toBeTruthy()
    })

    it('Render a label for select dropdown', () => {
      render(
        <AppointmentForm />
      )

      expect(labelFor('services')).toBeTruthy();
    })

    it('Select id matches label htmlFor value', () => {
      render(
        <AppointmentForm />
      )
      expect(field('service').id).toEqual(labelFor('services').htmlFor)
    })

    it('Saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service="Blow-dry"
          onSubmit={({ service }) =>
            expect(service).toEqual('Blow-dry')
          }
        />
      )
      await ReactTestUtils.Simulate.submit(form('appointment'));
    })

    it('Saves new value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service="Blow-dry"
          onSubmit={({ service }) =>
            expect(service).toEqual('Cut')
          }
        />
      )
      await ReactTestUtils.Simulate.change(field('services'), {
        target: { value: 'Cut', name: 'service' }
      });

      await ReactTestUtils.Simulate.submit(form('appointment'));
    })
  })

  describe('time slot table', () => {

    it('renders a table for time slots', () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull()
    })

    it('renders a time slot for every half an hour between open and close times', () => {
      render(
        <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDay = timeSlotTable().querySelectorAll(
        'tbody th'
      );
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');

    })

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });

    it('renders a radio button for each time slot', () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today} />
      )

      const cells = timeSlotTable().querySelectorAll('td');

      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).not.toBeNull();
    })

    it('does not render radio buttons for unavailable time slots', () => {
      render(<AppointmentForm availableTimeSlots={[]} />)
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    })


    it('sets radio button values to the index of the corresponding appointment', () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />);
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });


    it('saves new value when submitted', () => {
      expect.hasAssertions();
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(availableTimeSlots[1].startsAt)
          }
        />
      );

      ReactTestUtils.Simulate.change(startsAtField(1), {
        target: {
          value: availableTimeSlots[1].startsAt.toString(),
          name: 'startsAt'
        }
      });
      ReactTestUtils.Simulate.submit(form('appointment'));


    })

  })
})