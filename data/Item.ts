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