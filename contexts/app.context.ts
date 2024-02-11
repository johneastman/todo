import { createContext } from "react";
import { AppDataContext, Settings } from "../types";
import { AppAction, AppData } from "../data/reducers/app.reducer";

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
        isCopyModalVisible: false,
        isDeleteAllModalVisible: false,
    },
};

export const defaultAppContextData: AppDataContext = {
    data: defaultAppData,
    dispatch: (action: AppAction) => {
        throw Error("dispatch in default app data context is not implemented");
    },
};

export const AppContext = createContext<AppDataContext>(defaultAppContextData);
