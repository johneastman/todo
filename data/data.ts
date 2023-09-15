import { ListType, ListTypeValues, Position } from "../types";
import { RadioButton } from "../types";

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
    type: ListTypeValues;
    constructor(id: string, name: string, type: ListTypeValues) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

// Radio Buttons
export const TOP: RadioButton<Position> = { displayValue: "Top", position: "top" };
export const CURRENT: RadioButton<Position> = { displayValue: "Current Position", position: "current" };
export const BOTTOM: RadioButton<Position> = { displayValue: "Bottom", position: "bottom" };
export const OTHER: RadioButton<Position> = { displayValue: "Other", position: "other" };

// List types
export const listTypes: ListType[] = [
    { label: "Generic List", value: "List" },
    { label: "Shopping List", value: "Shopping" },
    { label: "To-Do List", value: "To-Do" },
];