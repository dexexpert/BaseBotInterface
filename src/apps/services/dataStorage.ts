let euFootballMatchData: any[] = [];
let nextEuFootballMatchData: any[] = [];

export const setEuFootballMatchData = (data: any[]) => {
  euFootballMatchData = data;
};
export const setNextEuFootballMatchData = (data: any[]) => {
  nextEuFootballMatchData = data;
};

export const getEuFootballMatchData = () => euFootballMatchData;
export const getNextEuFootballMatchData = () => nextEuFootballMatchData;

export const getResultData = () => {
  return [...euFootballMatchData, ...nextEuFootballMatchData];
};
