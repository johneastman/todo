import { createContext } from "react";
import { ListsContextData } from "../types";
import { ListsAction, ListsData } from "../data/reducers/lists.reducer";

export const defaultListsData: ListsData = {
    lists: [],
};

export const defaultListsContextData: ListsContextData = {
    data: defaultListsData,
    listsDispatch: (action: ListsAction) => {
        throw Error(
            "dispatch in default lists context data is not implemented"
        );
    },
};

export const ListsContext = createContext<ListsContextData>(
    defaultListsContextData
);
