import { ListTypeValue, Position, SelectionValue } from "../types";

// Data classes
export class Item {
    value: string;
    quantity: number;
    isComplete: boolean;
    constructor(
        value: string,
        quantity: number,
        isComplete: boolean = false
    ) {
        this.value = value;
        this.quantity = quantity;
        this.isComplete = isComplete;
    }
}

export class List {
    id: string;
    name: string;
    type: ListTypeValue;
    defaultNewItemPosition: Position;
    constructor(id: string, name: string, type: ListTypeValue, defaultNewItemPosition: Position) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.defaultNewItemPosition = defaultNewItemPosition;
    }
}

// Radio Buttons
export const TOP: SelectionValue<Position> = { label: "Top", value: "top" };
export const CURRENT: SelectionValue<Position> = { label: "Current Position", value: "current" };
export const BOTTOM: SelectionValue<Position> = { label: "Bottom", value: "bottom" };
export const OTHER: SelectionValue<Position> = { label: "Other", value: "other" };

// List types
export const listTypes: SelectionValue<ListTypeValue>[] = [
    { label: "Generic List", value: "List" },
    { label: "Shopping List", value: "Shopping" },
    { label: "To-Do List", value: "To-Do" },
];