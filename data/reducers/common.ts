export type ModalReducerActionType = "UPDATE_ERROR" | "REPLACE";

export interface ModalReducerAction {
    type: ModalReducerActionType;
}

export class UpdateError implements ModalReducerAction {
    type: ModalReducerActionType = "UPDATE_ERROR";
    newError?: string;
    constructor(newError?: string) {
        this.newError = newError;
    }
}

export class Replace<T> implements ModalReducerAction {
    type: ModalReducerActionType = "REPLACE";
    newState: T;
    constructor(newState: T) {
        this.newState = newState;
    }
}
