export function getPublicExhibitionFilter() {
  const currentDateString = new Date().toISOString().split("T")[0];

  return {
    show: true,
    image_reference: {
      $exists: true,
      $ne: [],
    },
    date_end_st: {
      $gt: currentDateString,
      $lt: "2048-06-16",
      $regex: /^\d{4}-\d{2}-\d{2}$/,
    },
    $or: [
      { date_begin_st: { $exists: false } },
      { date_begin_st: null },
      { date_begin_st: "" },
      {
        date_begin_st: {
          $not: { $regex: /^\d{4}-\d{2}-\d{2}$/ },
        },
      },
      {
        date_begin_st: {
          $lte: currentDateString,
          $regex: /^\d{4}-\d{2}-\d{2}$/,
        },
      },
    ],
  };
}
