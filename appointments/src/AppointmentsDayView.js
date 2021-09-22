import React from 'react';

const appointmentTimeOfDay = startsAt => {
   const [h, m] = new Date(startsAt).toTimeString().split(':');
   return `${h}:${m}`;
}

export const AppointmentsDayView = ({ appointments = [] }) => {
   const [selectedAppointment, setSelectedAppointment] = React.useState(
      0
   );

   return (
      <div id="appointmentsDayView">
         {appointments.length > 0 &&
            (<ol>
               {appointments.map((item, index) => (
                  <li key={index} >
                     <button
                        type="button"
                        onClick={() => {
                           setSelectedAppointment(index)
                        }}
                     >
                        <span>{appointmentTimeOfDay(item.startsAt)}</span>
                     </button>
                  </li>
               ))}
            </ol>
            )}

         {appointments.length === 0 ? (
            <p>There are no appointments scheduled for today.</p>
         ) : (
            <Appointment {...appointments[selectedAppointment]} />
         )}

      </div>
   )
};

export const Appointment = ({ customer }) => (
   <h3>{customer?.firstName}</h3>
)