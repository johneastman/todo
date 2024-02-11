import { UpdateError } from "../../data/reducers/common";
import {
    ItemModalState,
    UpdateName,
    UpdatePosition,
    UpdateQuantity,
    itemModalReducer,
} from "../../data/reducers/itemModal.reducer";
import { assertItemModalStateEqual } from "../testUtils";

describe("Item Modal Reducer", () => {
    const itemModalState: ItemModalState = {
        name: "My Item",
        position: "bottom",
        quantity: 1,
        error: "Name must be provided", // Setting the error tests it is reset when other values are updated.
    };

    it("updates name", () => {
        const actualState: ItemModalState = itemModalReducer(
            itemModalState,
            new UpdateName("My NEW Item")
        );
        const expectedState: ItemModalState = {
            name: "My NEW Item",
            quantity: 1,
            position: "bottom",
        };
        assertItemModalStateEqual(actualState, expectedState);
    });

    it("updates quantity", () => {
        const actualState: ItemModalState = itemModalReducer(
            itemModalState,
            new UpdateQuantity(5)
        );
        const expectedState: ItemModalState = {
            name: "My Item",
            quantity: 5,
            position: "bottom",
        };
        assertItemModalStateEqual(actualState, expectedState);
    });

    it("updates position", () => {
        const actualState: ItemModalState = itemModalReducer(
            itemModalState,
            new UpdatePosition("top")
        );
        const expectedState: ItemModalState = {
            name: "My Item",
            quantity: 1,
            position: "top",
        };
        assertItemModalStateEqual(actualState, expectedState);
    });

    it("updates error", () => {
        const state: ItemModalState = {
            name: "My Item",
            quantity: 1,
            position: "top",
        };
        const actualState: ItemModalState = itemModalReducer(
            state,
            new UpdateError("Name must be provided")
        );
        const expectedState: ItemModalState = {
            name: "My Item",
            quantity: 1,
            position: "top",
            error: "Name must be provided",
        };
        assertItemModalStateEqual(actualState, expectedState);
    });
});
