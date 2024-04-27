export type ModalActionType = "UPDATE_ERROR" | "REPLACE" | "UPDATE_SELECT_ALL";

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

export class UpdateSelectAll implements ModalAction {
    type: ModalActionType = "UPDATE_SELECT_ALL";
    newIgnoreSelectAll: boolean;
    constructor(ignoreSelectAll: boolean) {
        this.newIgnoreSelectAll = ignoreSelectAll;
    }
}
