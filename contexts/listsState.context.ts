import { createContext } from "react";
import {
    ListsState,
    ListsStateAction,
} from "../data/reducers/listsState.reducer";

export type ListsStateContextData = {
    listsState: ListsState;
    listsStateDispatch: (action: ListsStateAction) => void;
};

export const defaultListsStateData: ListsState = {
    isDeleteAllModalVisible: false,
    currentIndex: -1,
};

export const defaultListsStateContext: ListsStateContextData = {
    listsState: defaultListsStateData,
    listsStateDispatch: (action: ListsStateAction) => {
        throw Error(
            "dispatch for default lists state data context is not implemented"
        );
    },
};

export const ListsStateContext = createContext<ListsStateContextData>(
    defaultListsStateContext
);
