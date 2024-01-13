import { createContext } from "react";
import { Position } from "../../types";
import { areCellsSelected, updateCollection } from "../../utils";
import { List } from "../data";

export interface ItemsPageState {
    lists: List[];
    isDeleteAllListsModalVisible: boolean;
    isListModalVisible: boolean;
    currentListIndex: number;
}

type ListsPageActionType =
    | "REPLACE_LISTS"
    | "ADD_LIST"
    | "UPDATE_LIST"
    | "DELETE_LISTS"
    | "SELECT_LIST"
    | "SELECT_ALL"
    | "IS_DELETE_ALL_LISTS_MODAL_VISIBLE"
    | "IS_LIST_MODAL_VISIBLE"
    | "OPEN_LIST_MODAL"
    | "CLOSE_LIST_MODAL"
    | "ALT_ACTION";

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

export class IsModalVisible implements ListsPageAction {
    type: ListsPageActionType;
    isVisible: boolean;
    constructor(type: ListsPageActionType, isVisible: boolean) {
        this.type = type;
        this.isVisible = isVisible;
    }
}

export class IsDeleteAllListsModalVisible extends IsModalVisible {
    constructor(isVisible: boolean) {
        super("IS_DELETE_ALL_LISTS_MODAL_VISIBLE", isVisible);
    }
}

export class IsListModalVisible extends IsModalVisible {
    constructor(isVisible: boolean) {
        super("IS_LIST_MODAL_VISIBLE", isVisible);
    }
}

export class OpenListModal implements ListsPageAction {
    type: ListsPageActionType = "OPEN_LIST_MODAL";
    index: number;
    constructor(index: number) {
        this.index = index;
    }
}

export class CloseListModal implements ListsPageAction {
    type: ListsPageActionType = "CLOSE_LIST_MODAL";
}

export class AltAction implements ListsPageAction {
    type: ListsPageActionType = "ALT_ACTION";
}

export function listsPageReducer(
    prevState: ItemsPageState,
    action: ListsPageAction
): ItemsPageState {
    const {
        lists,
        isDeleteAllListsModalVisible,
        isListModalVisible,
        currentListIndex,
    } = prevState;

    switch (action.type) {
        case "REPLACE_LISTS": {
            return {
                lists: (action as ReplaceLists).lists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: isListModalVisible,
                currentListIndex: currentListIndex,
            };
        }
        case "ADD_LIST": {
            const { newList, newPosition } = action as AddLists;

            if (newList.name.trim().length <= 0) {
                return {
                    lists: lists,
                    isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                    isListModalVisible: false,
                    currentListIndex: currentListIndex,
                };
            }

            const newLists: List[] =
                newPosition === "top"
                    ? [newList].concat(lists)
                    : lists.concat([newList]);

            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: false,
                currentListIndex: currentListIndex,
            };
        }
        case "UPDATE_LIST": {
            const { newList, oldPosition, newPosition } = action as UpdateList;

            if (newList.name.trim().length <= 0) {
                return {
                    lists: lists,
                    isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                    isListModalVisible: false,
                    currentListIndex: currentListIndex,
                };
            }

            const newLists: List[] = updateCollection(
                newList,
                lists,
                oldPosition,
                newPosition
            );

            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: false,
                currentListIndex: currentListIndex,
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
                isListModalVisible: isListModalVisible,
                currentListIndex: currentListIndex,
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
                isListModalVisible: isListModalVisible,
                currentListIndex: currentListIndex,
            };
        }

        case "SELECT_ALL": {
            const newLists: List[] = lists.map((list) =>
                list.setIsSelected((action as SelectAll).isSelected)
            );

            return {
                lists: newLists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: isListModalVisible,
                currentListIndex: currentListIndex,
            };
        }

        case "IS_DELETE_ALL_LISTS_MODAL_VISIBLE": {
            return {
                lists: lists,
                isDeleteAllListsModalVisible: (
                    action as IsDeleteAllListsModalVisible
                ).isVisible,
                isListModalVisible: isListModalVisible,
                currentListIndex: currentListIndex,
            };
        }

        case "IS_LIST_MODAL_VISIBLE": {
            return {
                lists: lists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: (action as IsListModalVisible).isVisible,
                currentListIndex: currentListIndex,
            };
        }

        case "OPEN_LIST_MODAL": {
            return {
                lists: lists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: true,
                currentListIndex: (action as OpenListModal).index,
            };
        }

        case "CLOSE_LIST_MODAL":
            return {
                lists: lists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: false,
                currentListIndex: currentListIndex,
            };

        case "ALT_ACTION": {
            /**
             * If the user invokes the alternate action while adding a new list, the modal
             * will reset to add another list.
             *
             * If the user invokes the alternate action while editing a list, the modal will
             * reset to the next list, allowing the user to continually update subsequent
             * lists. If the user is on the last list and clicks "next", the modal will
             * dismiss itself.
             */
            if (currentListIndex === -1) {
                return {
                    lists: lists,
                    isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                    isListModalVisible: true,
                    currentListIndex: currentListIndex,
                };
            }

            return {
                lists: lists,
                isDeleteAllListsModalVisible: isDeleteAllListsModalVisible,
                isListModalVisible: currentListIndex + 1 < lists.length,
                currentListIndex: currentListIndex + 1,
            };
        }

        default: {
            throw Error(
                `Unknown action for lists page reducer: ${action.type}`
            );
        }
    }
}
