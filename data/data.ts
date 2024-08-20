import {
    ListType,
    CollectionViewCellType,
    MoveItemAction,
    Position,
    SelectionValue,
    CollectionViewCell,
} from "../types";

// Data classes
export type ItemFlags = {
    isComplete: boolean;
    isSelected?: boolean;
    isLocked?: boolean;
};

export class Item implements CollectionViewCell {
    name: string;
    type: CollectionViewCellType;
    isSelected: boolean;
    isLocked: boolean;

    notes: string;
    quantity: number;
    isComplete: boolean;

    constructor(
        name: string,
        notes: string,
        quantity: number,
        flags: ItemFlags
    ) {
        this.name = name;
        this.type = "Item";
        this.notes = notes;
        this.quantity = quantity;

        const { isComplete, isSelected, isLocked } = flags;
        this.isComplete = isComplete;
        this.isSelected = isSelected ?? false;
        this.isLocked = isLocked ?? false;
    }

    setIsSelected(isSelected: boolean): Item {
        const flags: ItemFlags = {
            isComplete: this.isComplete,
            isSelected: isSelected,
            isLocked: this.isLocked,
        };
        return new Item(this.name, this.notes, this.quantity, flags);
    }

    setIsComplete(isComplete: boolean): Item {
        const flags: ItemFlags = {
            isComplete: isComplete,
            isSelected: this.isSelected,
            isLocked: this.isLocked,
        };

        return new Item(this.name, this.notes, this.quantity, flags);
    }

    setIsLocked(isLocked: boolean): Item {
        const flags: ItemFlags = {
            isComplete: this.isComplete,
            isSelected: this.isSelected,
            isLocked: isLocked,
        };

        return new Item(this.name, this.notes, this.quantity, flags);
    }
}

export type ListFlags = {
    isSelected?: boolean;
    isLocked?: boolean;
};

export class List implements CollectionViewCell {
    name: string;
    type: CollectionViewCellType;
    isSelected: boolean;
    isLocked: boolean;

    listType: ListType;
    defaultNewItemPosition: Position;
    items: Item[];

    constructor(
        name: string,
        listType: ListType,
        defaultNewItemPosition: Position,
        items: Item[] = [],
        flags: ListFlags
    ) {
        this.name = name;
        this.type = "List";
        this.listType = listType;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.items = items;

        const { isSelected, isLocked } = flags;
        this.isSelected = isSelected ?? false;
        this.isLocked = isLocked ?? false;
    }

    areAnyItemsSelected(): boolean {
        return this.items.some((item) => item.isSelected);
    }

    setIsSelected(isSelected: boolean): List {
        const flags: ListFlags = {
            isSelected: isSelected,
            isLocked: this.isLocked,
        };

        return new List(
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            this.items,
            flags
        );
    }

    updateItems(newItems: Item[]): List {
        const flags: ListFlags = {
            isSelected: this.isSelected,
            isLocked: this.isLocked,
        };

        return new List(
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            newItems,
            flags
        );
    }

    selectAllItems(isSelected: boolean): List {
        const flags: ListFlags = {
            isSelected: this.isSelected,
            isLocked: this.isLocked,
        };

        return new List(
            this.name,
            this.listType,
            this.defaultNewItemPosition,
            this.items.map((item) => item.setIsSelected(isSelected)),
            flags
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
