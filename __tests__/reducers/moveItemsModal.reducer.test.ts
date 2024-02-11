import {
    MoveItemsModalState,
    UpdateAction,
    UpdateDestination,
    UpdateError,
    UpdateSource,
    moveItemsModalReducer,
} from "../../data/reducers/moveItemsModal.reducer";
import { assertMoveItemsModalStateEqual } from "../testUtils";

describe("Move Items Modal Reducer", () => {
    const prevState: MoveItemsModalState = {
        action: "Copy",
        source: 0,
        destination: 1,
        error: "A source list must be selected",
    };

    it("updates action", () => {
        const actualNewState: MoveItemsModalState = moveItemsModalReducer(
            prevState,
            new UpdateAction("Move")
        );

        const expectedNewState: MoveItemsModalState = {
            action: "Move",
            source: 0,
            destination: 1,
        };

        assertMoveItemsModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates source", () => {
        const actualNewState: MoveItemsModalState = moveItemsModalReducer(
            prevState,
            new UpdateSource(2)
        );

        const expectedNewState: MoveItemsModalState = {
            action: "Copy",
            source: 2,
            destination: 1,
        };

        assertMoveItemsModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates destination", () => {
        const actualNewState: MoveItemsModalState = moveItemsModalReducer(
            prevState,
            new UpdateDestination(2)
        );

        const expectedNewState: MoveItemsModalState = {
            action: "Copy",
            source: 0,
            destination: 2,
        };

        assertMoveItemsModalStateEqual(actualNewState, expectedNewState);
    });

    it("updates error", () => {
        const prevState: MoveItemsModalState = {
            action: "Copy",
            source: 0,
            destination: 1,
        };

        const actualNewState: MoveItemsModalState = moveItemsModalReducer(
            prevState,
            new UpdateError("A source list must be selected")
        );

        const expectedNewState: MoveItemsModalState = {
            action: "Copy",
            source: 0,
            destination: 1,
            error: "A source list must be selected",
        };

        assertMoveItemsModalStateEqual(actualNewState, expectedNewState);
    });
});
