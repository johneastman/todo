import { createContext } from "react";
import {
    ItemsState,
    ItemsStateAction,
} from "../data/reducers/itemsState.reducer";

export type ItemsStateContextData = {
    itemsState: ItemsState;
    itemsStateDispatch: (action: ItemsStateAction) => void;
};

export const defaultItemsStateData: ItemsState = {
    isCopyModalVisible: false,
    isDeleteAllModalVisible: false,
    isDrawerVisible: false,
    currentIndex: -1,
};

export const defaultItemsStateContext: ItemsStateContextData = {
    itemsState: defaultItemsStateData,
    itemsStateDispatch: (action: ItemsStateAction) => {
        throw Error(
            "dispatch for default items state data context is not implemented"
        );
    },
};

export const ItemsStateContext = createContext<ItemsStateContextData>(
    defaultItemsStateContext
);
