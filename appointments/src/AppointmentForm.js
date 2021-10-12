import React from 'react';
import { TimeSlotTable } from './TimeSlotTable';

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots
}) => {
  const [appointment, setAppointment] = React.useState({ service });

  const handleServiceChange = ({ target: { value } }) =>
    setAppointment(appointment => ({
      ...appointment,
      service: value
    }));

  const handleStartsAtChange = React.useCallback(
    ({ target: { value } }) =>
      setAppointment(appointment => ({
        ...appointment,
        startsAt: parseInt(value)
      })),
    []
  );

  return (
    <form id="appointment"
      onSubmit={() => onSubmit(appointment)}
    >
      <label htmlFor="services">Salon service</label>
      <select
        name="service"
        id="services"
        value={service}
        onChange={handleServiceChange}>
        <option />
        {selectableServices.map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
    </form>
  )
};

AppointmentForm.defaultProps = {
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  availableTimeSlots: [],
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard trim',
    'Extensions']
};