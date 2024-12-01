export const formatTime = (time: string): string => {
  const date = new Date(time);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = date.getDate().toString().padStart(2, '0');
  const month = monthNames[date.getMonth()];

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${day} ${month} ${hours
    .toString()
    .padStart(2, '0')}:${minutes} ${period}`;
};
