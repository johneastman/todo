import {
    ItemType,
    ListType,
    CollectionViewCellType,
    MoveItemAction,
    Position,
    SelectionValue,
    ListViewCell,
} from "../types";

// Data classes
export class Item implements ListViewCell {
    name: string;
    type: CollectionViewCellType;
    isSelected: boolean;

    quantity: number;
    itemType: ItemType;
    isComplete: boolean;

    constructor(
        name: string,
        quantity: number,
        itemType: ItemType,
        isComplete: boolean,
        isSelected: boolean = false
    ) {
        this.type = "Item";
        this.name = name;
        this.quantity = quantity;
        this.itemType = itemType;
        this.isComplete = isComplete;
        this.isSelected = isSelected;
    }

    setIsSelected(isSelected: boolean): Item {
        return new Item(
            this.name,
            this.quantity,
            this.itemType,
            this.isComplete,
            isSelected
        );
    }
}

export class List implements ListViewCell {
    name: string;
    type: CollectionViewCellType;
    isSelected: boolean;

    id: string;
    listType: ListType;
    defaultNewItemPosition: Position;
    items: Item[];

    constructor(
        id: string,
        name: string,
        listType: ListType,
        defaultNewItemPosition: Position,
        items: Item[] = [],
        isSelected: boolean = false
    ) {
        this.name = name;
        this.type = "List";
        this.isSelected = isSelected;

        this.id = id;
        this.listType = listType;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.items = items;
    }

    setIsSelected(isSelected: boolean): List {
        return new List(
            this.id,
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            this.items,
            isSelected
        );
    }

    updateItems(newItems: Item[]): List {
        return new List(
            this.id,
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            newItems,
            this.isSelected
        );
    }
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

// List Types
export const LIST: SelectionValue<ListType> = {
    label: "Generic List",
    value: "List",
};
export const SHOPPING: SelectionValue<ListType> = {
    label: "Shopping List",
    value: "Shopping",
};
export const TODO: SelectionValue<ListType> = {
    label: "To-Do List",
    value: "To-Do",
};
export const ORDERED_TODO: SelectionValue<ListType> = {
    label: "Ordered To-Do List",
    value: "Ordered To-Do",
};

export const listTypes: SelectionValue<ListType>[] = [
    LIST,
    SHOPPING,
    TODO,
    ORDERED_TODO,
];

// Move Item Action
export const MOVE: SelectionValue<MoveItemAction> = {
    label: "Move",
    value: "move",
};
export const COPY: SelectionValue<MoveItemAction> = {
    label: "Copy",
    value: "copy",
};
