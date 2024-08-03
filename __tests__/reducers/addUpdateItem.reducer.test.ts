import { UpdateError, UpdateIsLocked } from "../../data/reducers/common";
import {
    AddUpdateItemState,
    UpdateName,
    UpdateNotes,
    UpdatePosition,
    UpdateQuantity,
    addUpdateItemReducer,
} from "../../data/reducers/addUpdateItem.reducer";
import { assertItemModalStateEqual } from "../testUtils";

describe("Add Update Item Reducer", () => {
    const prevState: AddUpdateItemState = {
        name: "My Item",
        notes: "",
        position: "bottom",
        quantity: 1,
        error: "Name must be provided", // Setting the error tests it is reset when other values are updated.
        isLocked: false,
        currentIndex: -1,
    };

    it("updates name", () => {
        const actualNewState: AddUpdateItemState = addUpdateItemReducer(
            prevState,
            new UpdateName("My NEW Item")
        );
        const expectedNewState: AddUpdateItemState = {
            ...prevState,
            name: "My NEW Item",
            error: undefined,
        };
        assertItemModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates notes", () => {
        const actualNewState: AddUpdateItemState = addUpdateItemReducer(
            prevState,
            new UpdateNotes("new note")
        );
        const expectedNewState: AddUpdateItemState = {
            ...prevState,
            notes: "new note",
            error: undefined,
        };
        assertItemModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates quantity", () => {
        const actualNewState: AddUpdateItemState = addUpdateItemReducer(
            prevState,
            new UpdateQuantity(5)
        );
        const expectedNewState: AddUpdateItemState = {
            ...prevState,
            quantity: 5,
            error: undefined,
        };
        assertItemModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates position", () => {
        const actualNewState: AddUpdateItemState = addUpdateItemReducer(
            prevState,
            new UpdatePosition("top")
        );
        const expectedNewState: AddUpdateItemState = {
            ...prevState,
            position: "top",
            error: undefined,
        };
        assertItemModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates item is locked", () => {
        const actualNewState: AddUpdateItemState = addUpdateItemReducer(
            prevState,
            new UpdateIsLocked(true)
        );
        const expectedNewState: AddUpdateItemState = {
            ...prevState,
            isLocked: true,
            error: undefined,
        };
        assertItemModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates error", () => {
        const state: AddUpdateItemState = {
            name: "My Item",
            notes: "",
            quantity: 1,
            position: "top",
            isLocked: false,
            currentIndex: -1,
        };
        const actualState: AddUpdateItemState = addUpdateItemReducer(
            state,
            new UpdateError("Name must be provided")
        );
        const expectedState: AddUpdateItemState = {
            ...state,
            error: "Name must be provided",
        };
        assertItemModalStateEqual(actualState, expectedState);
    });
});
