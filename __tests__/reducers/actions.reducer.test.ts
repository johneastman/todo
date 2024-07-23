import {
    ActionsState,
    actionsStateReducer,
    AddAction,
    defaultActionsState,
    DeleteAction,
    UpdateAction,
    UpdateAll,
    UpdateCellsToSelect,
    UpdateError,
} from "../../data/reducers/actions.reducer";
import { assertActionsStateEqual } from "../testUtils";

describe("actions reducer", () => {
    const prevState: ActionsState = defaultActionsState();

    it("updates all", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateAll({
                cellsToSelect: "All",
                actions: ["Complete", "Incomplete"],
            })
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: "All",
            actions: ["Complete", "Incomplete"],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates cells to select", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateCellsToSelect("None")
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: "None",
            actions: [],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("adds action", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new AddAction("Lock")
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: undefined,
            actions: [undefined, "Lock"],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates action", () => {
        const oldState: ActionsState = {
            ...prevState,
            actions: ["Lock", "Unlock", "Complete"],
        };
        const actualNewState: ActionsState = actionsStateReducer(
            oldState,
            new UpdateAction(1, "Move")
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: undefined,
            actions: ["Lock", "Move", "Complete"],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("deletes action", () => {
        const oldState: ActionsState = {
            ...prevState,
            actions: ["Lock", "Unlock", "Complete"],
        };
        const actualNewState: ActionsState = actionsStateReducer(
            oldState,
            new DeleteAction(1)
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: undefined,
            actions: ["Lock", "Complete"],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates error", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateError("Error")
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: undefined,
            actions: [],
            error: "Error",
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });
});
