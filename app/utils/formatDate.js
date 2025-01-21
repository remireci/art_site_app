export const formatDate = (dateString) => {
  if (!dateString) return "";

  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];

  const [year, month, day] = dateString.split("-");
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
};
