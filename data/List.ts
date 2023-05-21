import { Item } from "./Item";

export class List {
    id: string;
    name: string;
    items: Item[];
    constructor(id: string, name: string, items: Item[]) {
        this.id = id;
        this.name = name;
        this.items = items;
    }
}
