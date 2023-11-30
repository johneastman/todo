import { StyleProp, TextStyle } from "react-native";
import { ListTypeValue, Position, SelectionValue } from "../types";


export interface ListViewCellItem {
    isSelected: boolean;
}

// Data classes
export class Item implements ListViewCellItem {
    value: string;
    quantity: number;
    isComplete: boolean;
    isSelected: boolean = false;

    constructor(
        value: string,
        quantity: number,
        isComplete: boolean,
        isSelected: boolean = false,
    ) {
        this.value = value;
        this.quantity = quantity;
        this.isComplete = isComplete;
        this.isSelected = isSelected;
    }
}

export class List implements ListViewCellItem {
    id: string;
    name: string;
    type: ListTypeValue;
    defaultNewItemPosition: Position;
    isSelected: boolean;

    constructor(id: string, name: string, type: ListTypeValue, defaultNewItemPosition: Position, isSelected: boolean = false) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.isSelected = isSelected;
    }
}

// Menu Options
export interface MenuOption {
    text: string;
    onPress: () => void;

    disabled?: boolean;
    textStyle?: StyleProp<TextStyle>;
    testId?: string;
}

// Item Positions
export const TOP: SelectionValue<Position> = { label: "Top", value: "top" };
export const CURRENT: SelectionValue<Position> = { label: "Current Position", value: "current" };
export const BOTTOM: SelectionValue<Position> = { label: "Bottom", value: "bottom" };
export const OTHER: SelectionValue<Position> = { label: "Other", value: "other" };

export const LIST: SelectionValue<ListTypeValue> =  { label: "Generic List", value: "List" };
export const SHOPPING: SelectionValue<ListTypeValue> =  { label: "Shopping List", value: "Shopping" };
export const TODO: SelectionValue<ListTypeValue> =  { label: "To-Do List", value: "To-Do" };

// List types
export const listTypes: SelectionValue<ListTypeValue>[] = [LIST, SHOPPING, TODO];