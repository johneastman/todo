import { ListType, ListTypeValues } from "../types";
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
export const TOP: RadioButton = { displayValue: "Top", position: "top" };
export const CURRENT: RadioButton = { displayValue: "Current Position", position: "current" };
export const BOTTOM: RadioButton = { displayValue: "Bottom", position: "bottom" };

// List types
export const listTypes: ListType[] = [
    { label: "Generic List", value: "List" },
    { label: "Shopping List", value: "Shopping" },
    { label: "To-Do List", value: "To-Do" },
];