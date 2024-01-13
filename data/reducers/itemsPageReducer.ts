import { ItemType, Position } from "../../types";
import { removeItemAtIndex, updateCollection } from "../../utils";
import { Item, Section } from "../data";
import { addItemToList } from "../utils";

type ItemsPageStateActionType =
    | "REPLACE_SECTIONS"
    | "ADD_ITEM"
    | "UPDATE_ITEM"
    | "DELETE_ITEM"
    | "SELECT_ALL";

interface ItemsPageStateAction {
    type: ItemsPageStateActionType;
}

interface ItemsPageState {
    sections: Section[];
}

export class ReplaceItems implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "REPLACE_SECTIONS";
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

export class DeleteItem implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "DELETE_ITEM";
}

export class SelectAll implements ItemsPageStateAction {
    type: ItemsPageStateActionType = "SELECT_ALL";
    isSelected: boolean;
    constructor(isSelected: boolean) {
        this.isSelected = isSelected;
    }
}

export function itemsPageReducer(
    prevState: ItemsPageState,
    action: ItemsPageStateAction
): ItemsPageState {
    const { sections } = prevState;

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
        case "REPLACE_SECTIONS": {
            const { items, sectionIndex } = action as ReplaceItems;
            return {
                sections: replaceSectionItems(sectionIndex, items),
            };
        }

        case "ADD_ITEM": {
            const { itemType, newPosition, newItem } = action as AddItem;

            if (itemType === "Section") {
                const newSection: Section = new Section(newItem.name);

                return {
                    sections:
                        newPosition === "top"
                            ? [newSection].concat(sections)
                            : sections.concat(newSection),
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

                return {
                    sections: replaceSectionItems(sectionIndex, newItems),
                };
            }
        }

        case "UPDATE_ITEM": {
            const { oldPosition, newPosition, item } = action as UpdateItem;

            // TODO: handle multiple sections
            const sectionIndex: number = 0;
            const sectionItems: Item[] = getSectionItems(sectionIndex);

            const newItems: Item[] = updateCollection(
                item,
                sectionItems,
                oldPosition,
                newPosition
            );

            return {
                sections: replaceSectionItems(sectionIndex, newItems),
            };
        }

        case "DELETE_ITEM": {
            // TODO: remove sections with no items but keep at least one section so the user can
            // add more items later.
            const sectionsWithKeptItems: Section[] = sections.map(
                ({ name, items }) =>
                    new Section(
                        name,
                        items.filter((item) => !item.isSelected)
                    )
            );
            return { sections: sectionsWithKeptItems };
        }

        case "SELECT_ALL": {
            const { isSelected } = action as SelectAll;

            const newSections: Section[] = sections.map((section) =>
                section.selectAllItems(isSelected)
            );
            return { sections: newSections };
        }

        default: {
            throw Error(
                `Unknown action for items page reducer: ${action.type}`
            );
        }
    }
}
