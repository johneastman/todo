import { Position } from "../../types";
import { areCellsSelected, updateCollection } from "../../utils";
import { List } from "../data";

export interface ItemsPageState {
    lists: List[];
    isDeleteAllListsModalVisible: boolean;
}

type ListsPageActionType =
    | "REPLACE_LISTS"
    | "ADD_LIST"
    | "UPDATE_LIST"
    | "DELETE_LISTS"
    | "SELECT_LIST"
    | "SELECT_ALL"
    | "IS_DELETE_ALL_LISTS_MODAL_VISIBLE";

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

export class IsDeleteAllListsModalVisible implements ListsPageAction {
    type: ListsPageActionType = "IS_DELETE_ALL_LISTS_MODAL_VISIBLE";
    isDeleteAllListsModalVisible: boolean;
    constructor(isDeleteAllListsModalVisible: boolean) {
        this.isDeleteAllListsModalVisible = isDeleteAllListsModalVisible;
    }
}

export function listsPageReducer(
    prevState: ItemsPageState,
    action: ListsPageAction
): ItemsPageState {
    const { lists, isDeleteAllListsModalVisible } = prevState;

    switch (action.type) {
        case "REPLACE_LISTS": {
            return {
                lists: (action as ReplaceLists).lists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
            };
        }
        case "ADD_LIST": {
            const { newList, newPosition } = action as AddLists;

            const newLists: List[] =
                newPosition === "top"
                    ? [newList].concat(lists)
                    : lists.concat([newList]);

            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
            };
        }
        case "UPDATE_LIST": {
            const { newList, oldPosition, newPosition } = action as UpdateList;
            const newLists: List[] = updateCollection(
                newList,
                lists,
                oldPosition,
                newPosition
            );

            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
            };
        }

        case "DELETE_LISTS": {
            // Lists we want to keep
            const newLists: List[] = areCellsSelected(lists)
                ? lists.filter((list) => !list.isSelected)
                : [];

            // The "delete all lists" modal should not be visible after deletion
            return {
                lists: newLists,
                isDeleteAllListsModalVisible: false,
            };
        }

        case "SELECT_LIST": {
            const { index, isSelected } = action as SelectList;
            const newLists: List[] = lists.map((list, i) =>
                list.setIsSelected(i === index ? isSelected : list.isSelected)
            );
            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
            };
        }

        case "SELECT_ALL": {
            const newLists: List[] = lists.map((list) =>
                list.setIsSelected((action as SelectAll).isSelected)
            );

            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
            };
        }

        case "IS_DELETE_ALL_LISTS_MODAL_VISIBLE": {
            return {
                lists: lists,
                isDeleteAllListsModalVisible: (
                    action as IsDeleteAllListsModalVisible
                ).isDeleteAllListsModalVisible,
            };
        }

        default: {
            throw Error(
                `Unknown action for lists page reducer: ${action.type}`
            );
        }
    }
}
