import React from 'react';

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) =>
      acc.concat([startTime + (i * increment)]));


const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return Array(7)
    .fill([midnight])
    .reduce((acc, _, i) =>
      acc.concat([midnight + (i * increment)])
    );
};

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return timeIncrements(totalSlots, startTime, increment);
}
const toTimeValue = timestamp =>
  new Date(timestamp).toTimeString().substring(0, 5);

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  const isChecked = startsAt === checkedTimeSlot;

  if (
    availableTimeSlots.some(availableTimeSlot =>
      availableTimeSlot.startsAt === startsAt
    )
  ) {
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
        readOnly
      />
    )
  }
  return null;
};

export const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  handleChange,
  availableTimeSlots
}) => {

  const timeSlots = dailyTimeSlots(
    salonOpensAt,
    salonClosesAt);

  const dates = weeklyDateValues(today);

  const toShortDate = timestamp => {
    const [day, , dayOfMonth] = new Date(timestamp)
      .toDateString()
      .split(' ');
    return `${day} ${dayOfMonth}`;
  };



  return (
    <table id="time-slots">
      <thead>
        <tr>
          {dates.map(d => (
            <th key={d}>{toShortDate(d)}</th>
          ))}

        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map(date => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

  )
}
