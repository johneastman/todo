import { ItemCRUD } from "../../types";
import {
    getSectionsItems,
    getSelectedCells,
    updateCollection,
} from "../../utils";
import { Item, Section } from "../data";

type ItemsPageStateActionType =
    | "REPLACE_ITEMS"
    | "ADD_ITEM"
    | "UPDATE_ITEM"
    | "DELETE_ITEMS"
    | "SELECT_ALL"
    | "SELECT_ITEM"
    | "SET_ALL_IS_COMPLETE"
    | "SET_ITEM_IS_COMPLETE"
    | "SET_ITEM_MODAL_VISIBLE"
    | "SET_DELETE_ALL_ITEMS_MODAL_VISIBLE"
    | "ALT_ACTION";

export interface ItemsPageStateAction {
    type: ItemsPageStateActionType;
}

export interface ItemsPageState {
    sections: Section[];
    itemBeingEdited?: Item;
    isItemModalVisible: boolean;
    isDeleteAllItemsModalVisible: boolean;
}

export class ReplaceItems implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "REPLACE_ITEMS";
    items: Item[];
    sectionIndex: number;
    constructor(items: Item[], sectionIndex: number) {
        this.items = items;
        this.sectionIndex = sectionIndex;
    }
}

export class AddItem implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "ADD_ITEM";
    itemCRUD: ItemCRUD;
    constructor(itemCRUD: ItemCRUD) {
        this.itemCRUD = itemCRUD;
    }
}

export class UpdateItem implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "UPDATE_ITEM";
    itemParams: ItemCRUD;
    constructor(itemParams: ItemCRUD) {
        this.itemParams = itemParams;
    }
}

export class DeleteItems implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "DELETE_ITEMS";
}

export class SelectAll implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "SELECT_ALL";
    isSelected: boolean;
    constructor(isSelected: boolean) {
        this.isSelected = isSelected;
    }
}

export class SelectItem implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "SELECT_ITEM";
    sectionIndex: number;
    itemIndex: number;
    isSelected: boolean;
    constructor(sectionIndex: number, itemIndex: number, isSelected: boolean) {
        this.sectionIndex = sectionIndex;
        this.itemIndex = itemIndex;
        this.isSelected = isSelected;
    }
}

export class SetAllIsComplete implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "SET_ALL_IS_COMPLETE";
    isComplete: boolean;
    constructor(isComplete: boolean) {
        this.isComplete = isComplete;
    }
}

export class SetItemIsComplete implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "SET_ITEM_IS_COMPLETE";
    sectionIndex: number;
    itemIndex: number;
    constructor(sectionIndex: number, itemIndex: number) {
        this.sectionIndex = sectionIndex;
        this.itemIndex = itemIndex;
    }
}

class SetModalVisible implements ItemsPageStateAction {
    type: ItemsPageStateActionType;
    isVisible: boolean;
    constructor(type: ItemsPageStateActionType, isVisible: boolean) {
        this.type = type;
        this.isVisible = isVisible;
    }
}

export class SetItemModalVisible extends SetModalVisible {
    itemBeingEdited?: Item;
    constructor(isVisible: boolean, itemBeingEdited?: Item) {
        super("SET_ITEM_MODAL_VISIBLE", isVisible);
        this.itemBeingEdited = itemBeingEdited;
    }
}

export class SetDeleteAllItemsModalVisible extends SetModalVisible {
    constructor(isVisible: boolean) {
        super("SET_DELETE_ALL_ITEMS_MODAL_VISIBLE", isVisible);
    }
}

export class AltAction implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "ALT_ACTION";
    itemIndex: number;
    constructor(itemIndex: number) {
        this.itemIndex = itemIndex;
    }
}

export function itemsPageReducer(
    prevState: ItemsPageState,
    action: ItemsPageStateAction
): ItemsPageState {
    const { sections, isItemModalVisible, isDeleteAllItemsModalVisible } =
        prevState;

    const replaceSectionItems = (
        sectionIndex: number,
        newItems: Item[]
    ): Section[] => {
        return sections.map((section, index) =>
            index === sectionIndex ? section.updateItems(newItems) : section
        );
    };

    const getSectionItems = (sectionIndex: number): Item[] =>
        sections[sectionIndex].items;

    switch (action.type) {
        case "REPLACE_ITEMS": {
            const { items, sectionIndex } = action as ReplaceItems;

            const newSections: Section[] = replaceSectionItems(
                sectionIndex,
                items
            );
            return {
                sections: newSections,
                isItemModalVisible: isItemModalVisible,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "ADD_ITEM": {
            const {
                itemCRUD: {
                    name,
                    quantity,
                    isComplete,
                    type,
                    newPosition,
                    sectionIndex,
                },
            } = action as AddItem;

            // If the user doesn't enter a name, "itemName" will be an empty string
            if (name.trim().length <= 0) {
                return {
                    sections: sections,
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: false,
                };
            }

            if (type === "Section") {
                const newSection: Section = new Section(name);
                const newSections: Section[] =
                    newPosition === "top"
                        ? [newSection].concat(sections)
                        : sections.concat(newSection);

                return {
                    sections: newSections,
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: false,
                };
            }

            const sectionItems: Item[] = getSectionItems(sectionIndex);

            const newItem: Item = new Item(name, quantity, isComplete);

            const newItems: Item[] =
                newPosition === "top"
                    ? [newItem].concat(sectionItems)
                    : sectionItems.concat(newItem);

            const newSections: Section[] = replaceSectionItems(
                sectionIndex,
                newItems
            );

            return {
                sections: newSections,
                isItemModalVisible: false,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "UPDATE_ITEM": {
            const {
                itemParams: {
                    name,
                    quantity,
                    isComplete,
                    oldPosition,
                    newPosition,
                    sectionIndex,
                },
            } = action as UpdateItem;

            // If the user doesn't enter a name, "itemName" will be an empty string
            if (name.trim().length <= 0) {
                return {
                    sections: sections,
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
                };
            }

            const sectionItems: Item[] = getSectionItems(sectionIndex);

            const newItem: Item = new Item(name, quantity, isComplete);

            const newItems: Item[] = updateCollection(
                newItem,
                sectionItems,
                oldPosition,
                newPosition
            );

            const newSections: Section[] = replaceSectionItems(
                sectionIndex,
                newItems
            );

            return {
                sections: newSections,
                isItemModalVisible: false,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "DELETE_ITEMS": {
            const items: Item[] = getSectionsItems(sections);
            const { areAnySelected } = getSelectedCells(items);

            if (areAnySelected) {
                /**
                 * Only delete selected items.
                 *
                 * Delete section that no longer have items in them. But keep the primary section even if it
                 * no longer has items in it.
                 */
                const sectionsWithKeptItems: Section[] = sections
                    .map((section) =>
                        section.updateItems(
                            section.items.filter(
                                ({ isSelected }) => !isSelected
                            )
                        )
                    )
                    .filter(
                        ({ items, isPrimary }) => items.length > 0 || isPrimary
                    );

                return {
                    sections: sectionsWithKeptItems,
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: false,
                };
            }

            /**
             * Delete all items and sections except the primary section.
             *
             * Make the item modal invisible after deletion for the case when an item is being
             * moved to another list.
             */
            return {
                sections: sections
                    .map((section) => section.updateItems([]))
                    .filter((section) => section.isPrimary),
                isItemModalVisible: false,
                isDeleteAllItemsModalVisible: false,
            };
        }

        case "SELECT_ALL": {
            const { isSelected } = action as SelectAll;

            const newSections: Section[] = sections.map((section) =>
                section.selectAllItems(isSelected)
            );
            return {
                sections: newSections,
                isItemModalVisible: isItemModalVisible,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "SELECT_ITEM": {
            const { sectionIndex, itemIndex, isSelected } =
                action as SelectItem;

            const newSections: Section[] = sections.map((section, index) =>
                index === sectionIndex
                    ? section.selectItem(itemIndex, isSelected)
                    : section
            );

            return {
                sections: newSections,
                isItemModalVisible: isItemModalVisible,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "SET_ALL_IS_COMPLETE": {
            const isComplete: boolean = (action as SetAllIsComplete).isComplete;
            const newSections: Section[] = sections.map((section) =>
                section.setAllIsComplete(isComplete)
            );
            return {
                sections: newSections,
                isItemModalVisible: isItemModalVisible,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "SET_ITEM_IS_COMPLETE": {
            const { sectionIndex, itemIndex } = action as SetItemIsComplete;

            const newSections: Section[] = sections.map((section, index) =>
                index === sectionIndex
                    ? section.completeItem(itemIndex)
                    : section
            );

            return {
                sections: newSections,
                isItemModalVisible: isItemModalVisible,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "SET_ITEM_MODAL_VISIBLE": {
            const { isVisible, itemBeingEdited } =
                action as SetItemModalVisible;

            // const itemIndex: number = getIndexOfItemBeingEdited(items);

            return {
                sections: sections,
                isItemModalVisible: isVisible,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
                itemBeingEdited: itemBeingEdited,
            };
        }

        case "ALT_ACTION": {
            const { itemIndex } = action as AltAction;
            /**
             * TODO: will need to handle moving through multiple sections. The current system
             * won't work because each sublist starts indexing at zero.
             *
             * If the user invokes the alternate action while adding a new list, the modal
             * will reset to add another list.
             *
             * If the user invokes the alternate action while editing a list, the modal will
             * reset to the next list, allowing the user to continually update subsequent
             * lists. If the user is on the last list and clicks "next", the modal will
             * dismiss itself.
             */
            if (itemIndex === -1) {
                return {
                    sections: sections,
                    isItemModalVisible: true,
                    isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
                };
            }

            const items: Item[] = getSectionsItems(sections);

            return {
                sections: sections,
                isItemModalVisible: itemIndex + 1 < items.length,
                isDeleteAllItemsModalVisible: isDeleteAllItemsModalVisible,
            };
        }

        case "SET_DELETE_ALL_ITEMS_MODAL_VISIBLE": {
            const { isVisible } = action as SetDeleteAllItemsModalVisible;

            return {
                sections: sections,
                isItemModalVisible: isItemModalVisible,
                isDeleteAllItemsModalVisible: isVisible,
            };
        }

        default: {
            throw Error(
                `Unknown action for items page reducer: ${action.type}`
            );
        }
    }
}
