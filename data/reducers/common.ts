export type ModalActionType = "UPDATE_ERROR" | "REPLACE";

export interface ModalAction {
    type: ModalActionType;
}

export class UpdateError implements ModalAction {
    type: ModalActionType = "UPDATE_ERROR";
    newError?: string;
    constructor(newError?: string) {
        this.newError = newError;
    }
}

export class Replace<T> implements ModalAction {
    type: ModalActionType = "REPLACE";
    newState: T;
    constructor(newState: T) {
        this.newState = newState;
    }
}
