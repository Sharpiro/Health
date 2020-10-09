const defaultSettings = {
  showAllFoods: false
};

const settingsText = localStorage.getItem("settings");
export const settings: typeof defaultSettings = settingsText ?
  JSON.parse(settingsText) :
  defaultSettings;
