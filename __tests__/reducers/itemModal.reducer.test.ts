import { UpdateError, UpdateIsLocked } from "../../data/reducers/common";
import {
    AddUpdateItemState,
    UpdateName,
    UpdatePosition,
    UpdateQuantity,
    itemModalReducer,
} from "../../data/reducers/addUpdateItem.reducer";
import { assertItemModalStateEqual } from "../testUtils";

describe("Item Modal Reducer", () => {
    const prevState: AddUpdateItemState = {
        name: "My Item",
        position: "bottom",
        quantity: 1,
        error: "Name must be provided", // Setting the error tests it is reset when other values are updated.
        isLocked: false,
        currentIndex: -1,
    };

    it("updates name", () => {
        const actualNewState: AddUpdateItemState = itemModalReducer(
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

    it("updates quantity", () => {
        const actualNewState: AddUpdateItemState = itemModalReducer(
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
        const actualNewState: AddUpdateItemState = itemModalReducer(
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
        const actualNewState: AddUpdateItemState = itemModalReducer(
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
            quantity: 1,
            position: "top",
            isLocked: false,
            currentIndex: -1,
        };
        const actualState: AddUpdateItemState = itemModalReducer(
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
