import { ItemType, Position } from "../../types";
import { areCellsSelected, updateCollection } from "../../utils";
import { Item, Section } from "../data";

type ItemsPageStateActionType =
    | "REPLACE_ITEMS"
    | "ADD_ITEM"
    | "UPDATE_ITEM"
    | "DELETE_ITEMS"
    | "SELECT_ALL"
    | "SET_ALL_IS_COMPLETE"
    | "OPEN_ITEM_MODAL";

interface ItemsPageStateAction {
    type: ItemsPageStateActionType;
}

interface ItemsPageState {
    sections: Section[];
    items: Item[];
    isItemModalVisible: boolean;
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
    itemType: ItemType;
    newPosition: Position;
    newItem: Item;
    constructor(itemType: ItemType, newPosition: Position, newItem: Item) {
        this.itemType = itemType;
        this.newPosition = newPosition;
        this.newItem = newItem;
    }
}

export class UpdateItem implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "UPDATE_ITEM";
    oldPosition: number;
    newPosition: Position;
    item: Item;
    constructor(oldPosition: number, newPosition: Position, item: Item) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.item = item;
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

export class SetAllIsComplete implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "SET_ALL_IS_COMPLETE";
    isComplete: boolean;
    constructor(isComplete: boolean) {
        this.isComplete = isComplete;
    }
}

export class ModalVisible implements ItemsPageStateAction {
    type: ItemsPageStateActionType;
    isVisible: boolean;
    constructor(type: ItemsPageStateActionType, isVisible: boolean) {
        this.type = type;
        this.isVisible = isVisible;
    }
}

export class OpenItemModal extends ModalVisible {
    constructor(isVisible: boolean) {
        super("OPEN_ITEM_MODAL", isVisible);
    }
}

export function itemsPageReducer(
    prevState: ItemsPageState,
    action: ItemsPageStateAction
): ItemsPageState {
    const { sections, items, isItemModalVisible } = prevState;

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

    const getItems = (sections: Section[]): Item[] =>
        sections.flatMap((section) => section.items);

    switch (action.type) {
        case "REPLACE_ITEMS": {
            const { items, sectionIndex } = action as ReplaceItems;

            const newSections: Section[] = replaceSectionItems(
                sectionIndex,
                items
            );
            return {
                sections: newSections,
                items: getItems(newSections),
                isItemModalVisible: isItemModalVisible,
            };
        }

        case "ADD_ITEM": {
            const { itemType, newPosition, newItem } = action as AddItem;

            // If the user doesn't enter a name, "itemName" will be an empty string
            if (newItem.name.trim().length <= 0) {
                return {
                    sections: sections,
                    items: items,
                    isItemModalVisible: false,
                };
            }

            if (itemType === "Section") {
                const newSection: Section = new Section(newItem.name);
                const newSections: Section[] =
                    newPosition === "top"
                        ? [newSection].concat(sections)
                        : sections.concat(newSection);

                return {
                    sections: newSections,
                    items: getItems(newSections),
                    isItemModalVisible: false,
                };
            } else {
                // Add a new item
                //
                // TODO: for now, add to first section, but later we'll need to determine what section the item
                // should be added to.
                const sectionIndex: number = 0;
                const sectionItems: Item[] = getSectionItems(sectionIndex);

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
                    items: getItems(newSections),
                    isItemModalVisible: false,
                };
            }
        }

        case "UPDATE_ITEM": {
            const { oldPosition, newPosition, item } = action as UpdateItem;

            // If the user doesn't enter a name, "itemName" will be an empty string
            if (item.name.trim().length <= 0) {
                return {
                    sections: sections,
                    items: items,
                    isItemModalVisible: false,
                };
            }

            // TODO: handle multiple sections
            const sectionIndex: number = 0;
            const sectionItems: Item[] = getSectionItems(sectionIndex);

            const newItems: Item[] = updateCollection(
                item,
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
                items: getItems(newSections),
                isItemModalVisible: false,
            };
        }

        case "DELETE_ITEMS": {
            const areItemsSelected: boolean = areCellsSelected(
                sections.flatMap((section) => section.items)
            );

            // TODO: remove sections with no items but keep at least one section so the user can
            // add more items later.

            if (areItemsSelected) {
                // Only delete selected items
                const sectionsWithKeptItems: Section[] = sections.map(
                    ({ name, items }) =>
                        new Section(
                            name,
                            items.filter((item) => !item.isSelected)
                        )
                );
                return {
                    sections: sectionsWithKeptItems,
                    items: getItems(sectionsWithKeptItems),
                    isItemModalVisible: isItemModalVisible,
                };
            }

            // Delete all Items
            return {
                sections: sections.map(({ name }) => new Section(name, [])),
                items: [],
                isItemModalVisible: isItemModalVisible,
            };
        }

        case "SELECT_ALL": {
            const { isSelected } = action as SelectAll;

            const newSections: Section[] = sections.map((section) =>
                section.selectAllItems(isSelected)
            );
            return {
                sections: newSections,
                items: getItems(newSections),
                isItemModalVisible: isItemModalVisible,
            };
        }

        case "SET_ALL_IS_COMPLETE": {
            const isComplete: boolean = (action as SetAllIsComplete).isComplete;
            const newSections: Section[] = sections.map((section) =>
                section.setAllIsComplete(isComplete)
            );
            return {
                sections: newSections,
                items: getItems(newSections),
                isItemModalVisible: isItemModalVisible,
            };
        }

        case "OPEN_ITEM_MODAL": {
            return {
                sections: sections,
                items: items,
                isItemModalVisible: (action as OpenItemModal).isVisible,
            };
        }

        default: {
            throw Error(
                `Unknown action for items page reducer: ${action.type}`
            );
        }
    }
}
