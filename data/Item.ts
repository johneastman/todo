export class Item {
    listId: string;
    value: string;
    quantity: number;
    isComplete: boolean;
    constructor(
        listId: string,
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