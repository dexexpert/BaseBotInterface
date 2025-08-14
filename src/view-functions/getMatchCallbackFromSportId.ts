export const getMatchCallbackFromSportId = (
  sport_id: number,
  next12: boolean
) => {
  const callbackName: { [key: number]: string } = {
    1: "euFootball",
    18: "basketball",
    12: "naFootball",
    // Add more sports as needed
  };
  return (next12 ? "next" : "") + callbackName[sport_id];
};
