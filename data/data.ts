import {
    ListTypeValue,
    ListViewCellItemType,
    MoveItemAction,
    Position,
    SelectionValue,
} from "../types";
import { areCellsSelected } from "../utils";

export interface ListViewCellItem {
    name: string;
    type: ListViewCellItemType;

    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => ListViewCellItem;
}

// Data classes
export class Item implements ListViewCellItem {
    name: string;
    type: ListViewCellItemType;
    isSelected: boolean;

    quantity: number;
    isComplete: boolean;

    constructor(
        name: string,
        quantity: number,
        isComplete: boolean,
        isSelected: boolean = false
    ) {
        this.type = "Item";
        this.name = name;
        this.quantity = quantity;
        this.isComplete = isComplete;
        this.isSelected = isSelected;
    }

    setIsSelected(isSelected: boolean): Item {
        return new Item(this.name, this.quantity, this.isComplete, isSelected);
    }

    setIsComplete(isComplete: boolean): Item {
        return new Item(this.name, this.quantity, isComplete, this.isSelected);
    }
}

export class Section {
    name: string;
    items: Item[];
    constructor(name: string, items: Item[] = []) {
        this.name = name;
        this.items = items;
    }

    updateItem(itemIndex: number, newItem: Item): Section {
        const newItems: Item[] = this.items.map((item, index) =>
            index === itemIndex ? newItem : item
        );
        return new Section(this.name, newItems);
    }

    updateItems(items: Item[]): Section {
        return new Section(this.name, items);
    }

    selectItem(itemIndex: number, isSelected: boolean): Section {
        const newItems: Item[] = this.items.map((item, index) =>
            index === itemIndex ? item.setIsSelected(isSelected) : item
        );

        return new Section(this.name, newItems);
    }

    selectAllItems(isSelected: boolean): Section {
        const newItems: Item[] = this.items.map((item) =>
            item.setIsSelected(isSelected)
        );
        return new Section(this.name, newItems);
    }

    deleteItems(): Section {
        // When items are selected, filter out items NOT selected because theoe are the items we want to keep.
        const newItems: Item[] = areCellsSelected(this.items)
            ? this.items.filter((item) => !item.isSelected)
            : [];
        return new Section(this.name, newItems);
    }

    setAllIsComplete(isComplete: boolean): Section {
        const itemsSelected: boolean = areCellsSelected(this.items);

        const newItems: Item[] = this.items.map((item) => {
            if (itemsSelected) {
                // Only apply the changes to items that are currently selected.
                const newIsComplete: boolean = item.isSelected
                    ? isComplete
                    : item.isComplete;
                return new Item(item.name, item.quantity, newIsComplete);
            }
            // When no items are selected, apply changes to all items.
            return new Item(item.name, item.quantity, isComplete);
        });

        return new Section(this.name, newItems);
    }
}

export class List implements ListViewCellItem {
    type: ListViewCellItemType;
    isSelected: boolean;

    id: string;
    name: string;
    listType: ListTypeValue;
    defaultNewItemPosition: Position;
    sections: Section[];

    constructor(
        id: string,
        name: string,
        listType: ListTypeValue,
        defaultNewItemPosition: Position,
        sections: Section[],
        isSelected: boolean = false
    ) {
        this.type = "List";
        this.isSelected = isSelected;

        this.id = id;
        this.name = name;
        this.listType = listType;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.sections = sections;
    }

    items(): Item[] {
        return this.sections.flatMap((sections) => sections.items);
    }

    sectionItems(sectionIndex: number): Item[] {
        return this.sections[sectionIndex].items;
    }

    numItems(): number {
        return this.items().length;
    }

    setIsSelected(isSelected: boolean): List {
        return new List(
            this.id,
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            this.sections,
            isSelected
        );
    }

    selectAllItems(isSelected: boolean): List {
        const newSections: Section[] = this.sections.map((section) =>
            section.selectAllItems(isSelected)
        );
        return this.replaceSections(newSections);
    }

    updateItem(sectionIndex: number, itemIndex: number, item: Item): List {
        const newSections: Section[] = this.sections.map((section, index) =>
            index === sectionIndex
                ? section.updateItem(itemIndex, item)
                : section
        );
        return this.replaceSections(newSections);
    }

    updateSectionItems(sectionIndex: number, newItems: Item[]): List {
        const newSections: Section[] = this.sections.map((section, index) =>
            index === sectionIndex ? section.updateItems(newItems) : section
        );

        return this.replaceSections(newSections);
    }

    addSection(position: Position, section: Section): List {
        const newSections: Section[] =
            position === "top"
                ? [section].concat(this.sections)
                : this.sections.concat(section);

        return this.replaceSections(newSections);
    }

    setAllIsComplete(isComplete: boolean): List {
        const newSections: Section[] = this.sections.map((section) =>
            section.setAllIsComplete(isComplete)
        );
        return this.replaceSections(newSections);
    }

    deleteItems(): List {
        const newSections: Section[] = this.sections
            .map((section) => section.deleteItems()) // Delete items
            .filter((section) => section.items.length > 0); // Remove sections with no items

        return this.replaceSections(newSections);
    }

    replaceSections(newSections: Section[]): List {
        return new List(
            this.id,
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            newSections,
            this.isSelected
        );
    }
}

export interface Settings {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListTypeValue;
    defaultListPosition: Position;
    updateSettings: (settings: Settings) => void;
}

// Menu Options
export interface MenuOption {
    text: string;
    onPress: () => void;

    disabled?: boolean;
    color?: string;
    testId?: string;
}

// Item Position
export const TOP: SelectionValue<Position> = { label: "Top", value: "top" };
export const CURRENT: SelectionValue<Position> = {
    label: "Current Position",
    value: "current",
};
export const BOTTOM: SelectionValue<Position> = {
    label: "Bottom",
    value: "bottom",
};
export const OTHER: SelectionValue<Position> = {
    label: "Other",
    value: "other",
};

export const newPositions: SelectionValue<Position>[] = [TOP, BOTTOM];

// List Type
export const LIST: SelectionValue<ListTypeValue> = {
    label: "Generic List",
    value: "List",
};
export const SHOPPING: SelectionValue<ListTypeValue> = {
    label: "Shopping List",
    value: "Shopping",
};
export const TODO: SelectionValue<ListTypeValue> = {
    label: "To-Do List",
    value: "To-Do",
};
export const ORDERED_TODO: SelectionValue<ListTypeValue> = {
    label: "Ordered To-Do List",
    value: "Ordered To-Do",
};

// Move Item Action
export const MOVE: SelectionValue<MoveItemAction> = {
    label: "Move",
    value: "move",
};
export const COPY: SelectionValue<MoveItemAction> = {
    label: "Copy",
    value: "copy",
};

// List types
export const listTypes: SelectionValue<ListTypeValue>[] = [
    LIST,
    SHOPPING,
    TODO,
    ORDERED_TODO,
];
