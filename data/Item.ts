export class Item {
    listId: number;
    value: string;
    quantity: number;
    isComplete: boolean;
    constructor(
        listId: number,
        value: string,
        quantity: number,
        isComplete: boolean = false
    ) {
        this.listId = listId;
        this.value = value;
        this.quantity = quantity;
        this.isComplete = isComplete;
    }
}