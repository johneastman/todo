import { createContext } from "react";
import { AppDataContext } from "../types";
import { AppAction, AppData } from "../data/reducers/app.reducer";

export const defaultAppData: AppData = {
    lists: [],
};

export const defaultAppContextData: AppDataContext = {
    data: defaultAppData,
    dispatch: (action: AppAction) => {
        throw Error("dispatch in default app data context is not implemented");
    },
};

export const AppContext = createContext<AppDataContext>(defaultAppContextData);
