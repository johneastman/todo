import { Position } from "../../types";
import { areCellsSelected, updateCollection } from "../../utils";
import { List } from "../data";

type ListsPageActionType =
    | "REPLACE_LISTS"
    | "ADD_LIST"
    | "UPDATE_LIST"
    | "DELETE_LISTS"
    | "SELECT_LIST"
    | "SELECT_ALL";

export interface ListsPageAction {
    type: ListsPageActionType;
}

export class ReplaceLists implements ListsPageAction {
    type: ListsPageActionType = "REPLACE_LISTS";
    lists: List[];
    constructor(lists: List[]) {
        this.lists = lists;
    }
}

export class AddLists implements ListsPageAction {
    type: ListsPageActionType = "ADD_LIST";
    newList: List;
    newPosition: Position;
    constructor(newList: List, newPosition: Position) {
        this.newList = newList;
        this.newPosition = newPosition;
    }
}

export class UpdateList implements ListsPageAction {
    type: ListsPageActionType = "UPDATE_LIST";
    newList: List;
    oldPosition: number;
    newPosition: Position;
    constructor(newList: List, oldPosition: number, newPosition: Position) {
        this.newList = newList;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
}

export class DeleteLists implements ListsPageAction {
    type: ListsPageActionType = "DELETE_LISTS";
}

export class SelectList implements ListsPageAction {
    type: ListsPageActionType = "SELECT_LIST";
    index: number;
    isSelected: boolean;
    constructor(index: number, isSelected: boolean) {
        this.index = index;
        this.isSelected = isSelected;
    }
}

export class SelectAll implements ListsPageAction {
    type: ListsPageActionType = "SELECT_ALL";
    isSelected: boolean;
    constructor(isSelected: boolean) {
        this.isSelected = isSelected;
    }
}

export function listsPageReducer(
    prevState: List[],
    action: ListsPageAction
): List[] {
    switch (action.type) {
        case "REPLACE_LISTS": {
            return (action as ReplaceLists).lists;
        }
        case "ADD_LIST": {
            const { newList, newPosition } = action as AddLists;

            return newPosition === "top"
                ? [newList].concat(prevState)
                : prevState.concat([newList]);
        }
        case "UPDATE_LIST": {
            const { newList, oldPosition, newPosition } = action as UpdateList;
            return updateCollection(
                newList,
                prevState,
                oldPosition,
                newPosition
            );
        }

        case "DELETE_LISTS": {
            // Lists we want to keep
            return areCellsSelected(prevState)
                ? prevState.filter((list) => !list.isSelected)
                : [];
        }

        case "SELECT_LIST": {
            const { index, isSelected } = action as SelectList;
            return prevState.map((list, i) =>
                list.setIsSelected(i === index ? isSelected : list.isSelected)
            );
        }

        case "SELECT_ALL": {
            return prevState.map((list) =>
                list.setIsSelected((action as SelectAll).isSelected)
            );
        }

        default:
            throw Error(
                `Unknown action for lists page reducer: ${action.type}`
            );
    }
}
