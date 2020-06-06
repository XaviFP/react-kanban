export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      console.log("serializedState is NULL");
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    let localState = { ...state };
    const serializedState = JSON.stringify(localState);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    console.log(error);
  }
};
