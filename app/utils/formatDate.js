export const formatDate = (dateString) => {
  if (!dateString) return "";

  const months = [
    "jan", "feb", "mar", "apr", "mai", "jun",
    "jul", "aug", "sep", "okt", "nov", "dec"
  ];

  const [year, month, day] = dateString.split("-");
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
};
