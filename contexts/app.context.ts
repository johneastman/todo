import { createContext } from "react";
import { appReducer } from "../data/reducers/app.reducer";
import { AppAction, AppData, AppDataContext, Settings } from "../types";

export const defaultSettings: Settings = {
    isDeveloperModeEnabled: false,
    defaultListType: "List",
    defaultListPosition: "bottom",
};

export const defaultAppData: AppData = {
    settings: defaultSettings,
    lists: [],
    listsState: {
        isModalVisible: false,
        isDeleteAllModalVisible: false,
        currentIndex: -1,
    },
    itemsState: {
        isModalVisible: false,
        currentIndex: -1,
    },
};

export const AppContext = createContext<AppDataContext>({
    data: defaultAppData,
    dispatch: (action: AppAction) => {
        throw Error("dispatch in default app data context is not implemented");
    },
});
