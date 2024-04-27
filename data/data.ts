import {
    ListType,
    CollectionViewCellType,
    MoveItemAction,
    Position,
    SelectionValue,
    CollectionViewCell,
} from "../types";

// Data classes
export class Item implements CollectionViewCell {
    name: string;
    type: CollectionViewCellType;
    isSelected: boolean;
    ignoreSelectAll: boolean;

    quantity: number;
    isComplete: boolean;

    constructor(
        name: string,
        quantity: number,
        isComplete: boolean,
        isSelected: boolean = false,
        ignoreSelectAll: boolean = false
    ) {
        this.name = name;
        this.type = "Item";
        this.isSelected = isSelected;
        this.ignoreSelectAll = ignoreSelectAll;
        this.quantity = quantity;
        this.isComplete = isComplete;
    }

    setIsSelected(isSelected: boolean): Item {
        return new Item(
            this.name,
            this.quantity,
            this.isComplete,
            isSelected,
            this.ignoreSelectAll
        );
    }

    setIsComplete(isComplete: boolean): Item {
        return new Item(
            this.name,
            this.quantity,
            isComplete,
            this.isSelected,
            this.ignoreSelectAll
        );
    }
}

export class List implements CollectionViewCell {
    name: string;
    type: CollectionViewCellType;
    isSelected: boolean;
    ignoreSelectAll: boolean;

    listType: ListType;
    defaultNewItemPosition: Position;
    items: Item[];

    constructor(
        name: string,
        listType: ListType,
        defaultNewItemPosition: Position,
        items: Item[] = [],
        isSelected: boolean = false,
        ignoreSelectAll: boolean = true
    ) {
        this.name = name;
        this.type = "List";
        this.isSelected = isSelected;
        this.ignoreSelectAll = ignoreSelectAll;

        this.listType = listType;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.items = items;
    }

    areAnyItemsSelected(): boolean {
        return this.items.some((item) => item.isSelected);
    }

    hasItems(): boolean {
        return this.items.length > 0;
    }

    setIsSelected(isSelected: boolean): List {
        return new List(
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            this.items,
            isSelected,
            this.ignoreSelectAll
        );
    }

    updateItems(newItems: Item[]): List {
        return new List(
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            newItems,
            this.isSelected,
            this.ignoreSelectAll
        );
    }

    selectAllItems(isSelected: boolean): List {
        return new List(
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            this.items.map((item) => item.setIsSelected(isSelected)),
            this.isSelected,
            this.ignoreSelectAll
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
    value: "Move",
};
export const COPY: SelectionValue<MoveItemAction> = {
    label: "Copy",
    value: "Copy",
};
