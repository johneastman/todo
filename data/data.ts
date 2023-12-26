import { ItemType, ListTypeValue, ListViewCellItemType, MoveItemAction, Position, SelectionValue } from "../types";
import { ItemJSON, ListJSON } from "./utils";


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
    itemType: ItemType;
    isComplete: boolean;


    constructor(
        name: string,
        quantity: number,
        itemType: ItemType,
        isComplete: boolean,
        isSelected: boolean = false,
    ) {
        this.type = "Item"
        this.name = name;
        this.quantity = quantity;
        this.itemType = itemType;
        this.isComplete = isComplete;
        this.isSelected = isSelected;
    }

    setIsSelected(isSelected: boolean): Item {
        return new Item(this.name, this.quantity, this.itemType, this.isComplete, isSelected);
    }
}

export class List implements ListViewCellItem {
    name: string;
    type: ListViewCellItemType;
    isSelected: boolean;

    id: string;
    listType: ListTypeValue;
    defaultNewItemPosition: Position;
    items: Item[];

    constructor(id: string, name: string, listType: ListTypeValue, defaultNewItemPosition: Position, items: Item[] = [], isSelected: boolean = false) {
        this.name = name;
        this.type = "List";
        this.isSelected = isSelected;
        
        this.id = id;
        this.listType = listType;
        this.defaultNewItemPosition = defaultNewItemPosition;
        this.items = items;
    }

    setIsSelected(isSelected: boolean): List {
        return new List(this.id, this.name, this.listType, this.defaultNewItemPosition, this.items, isSelected);
    }

    updateItems(newItems: Item[]): List {
        return new List(this.id, this.name, this.listType, this.defaultNewItemPosition, newItems, this.isSelected);
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

// Item Position
export const TOP: SelectionValue<Position> = { label: "Top", value: "top" };
export const CURRENT: SelectionValue<Position> = { label: "Current Position", value: "current" };
export const BOTTOM: SelectionValue<Position> = { label: "Bottom", value: "bottom" };
export const OTHER: SelectionValue<Position> = { label: "Other", value: "other" };

export const newPositions: SelectionValue<Position>[] = [TOP, BOTTOM];

// List Type
export const LIST: SelectionValue<ListTypeValue> =  { label: "Generic List", value: "List" };
export const SHOPPING: SelectionValue<ListTypeValue> =  { label: "Shopping List", value: "Shopping" };
export const TODO: SelectionValue<ListTypeValue> =  { label: "To-Do List", value: "To-Do" };
export const ORDERED_TODO: SelectionValue<ListTypeValue> =  { label: "Ordered To-Do List", value: "Ordered To-Do" };

// Move Item Action
export const MOVE: SelectionValue<MoveItemAction> = {label: "Move", value: "move"};
export const COPY: SelectionValue<MoveItemAction> = {label: "Copy", value: "copy"};

// List types
export const listTypes: SelectionValue<ListTypeValue>[] = [LIST, SHOPPING, TODO, ORDERED_TODO];