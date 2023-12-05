import { ListTypeValue, ListViewCellItemType, Position, SelectionValue } from "../types";


export interface ListViewCellItem {
    name: string;
    type: ListViewCellItemType;
    
    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => ListViewCellItem;
}

// Data classes
export class Item implements ListViewCellItem {
    type: ListViewCellItemType;
    name: string;
    quantity: number;
    isComplete: boolean;
    isSelected: boolean = false;

    constructor(
        name: string,
        quantity: number,
        isComplete: boolean,
        isSelected: boolean = false,
    ) {
        this.type = "Item"
        this.name = name;
        this.quantity = quantity;
        this.isComplete = isComplete;
        this.isSelected = isSelected;
    }

    setIsSelected(isSelected: boolean): Item {
        return new Item(this.name, this.quantity, this.isComplete, isSelected);
    }
}

export class List implements ListViewCellItem {
    type: ListViewCellItemType;
    id: string;
    name: string;
    listType: ListTypeValue;
    defaultNewItemPosition: Position;
    isSelected: boolean;

    constructor(id: string, name: string, listType: ListTypeValue, defaultNewItemPosition: Position, isSelected: boolean = false) {
        this.type = "List";
        this.id = id;
        this.name = name;
        this.listType = listType;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.isSelected = isSelected;
    }

    setIsSelected(isSelected: boolean): List {
        return new List(this.id, this.name, this.listType, this.defaultNewItemPosition, isSelected);
    }
}

// Menu Options
export interface MenuOption {
    text: string;
    onPress: () => void;

    disabled?: boolean;
    color?: string;
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