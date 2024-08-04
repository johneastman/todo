import { UpdateError } from "../../data/reducers/common";
import {
    AddUpdateListState,
    UpdateDefaultNewItemPosition,
    UpdateListType,
    UpdateName,
    UpdatePosition,
    addUpdateListReducer,
} from "../../data/reducers/addUpdateList.reducer";
import { assertAddUpdateListStateEqual } from "../testUtils";

describe("list modal reducer", () => {
    const addUpdateListState: AddUpdateListState = {
        name: "My List",
        listType: "Shopping",
        defaultNewItemPosition: "bottom",
        position: "bottom",
        error: "Name must be provided", // Setting the error tests it is reset when other values are updated.
        currentIndex: -1,
    };

    it("updates name", () => {
        const newAddUpdateListState: AddUpdateListState = addUpdateListReducer(
            addUpdateListState,
            new UpdateName("My Updated List")
        );

        const expectedNewAddUpdateListState: AddUpdateListState = {
            ...addUpdateListState,
            name: "My Updated List",
            error: undefined,
        };

        assertAddUpdateListStateEqual(
            newAddUpdateListState,
            expectedNewAddUpdateListState
        );
    });

    it("updates list type", () => {
        const newAddUpdateListState: AddUpdateListState = addUpdateListReducer(
            addUpdateListState,
            new UpdateListType("Ordered To-Do")
        );

        const expectedNewAddUpdateListState: AddUpdateListState = {
            ...addUpdateListState,
            listType: "Ordered To-Do",
            error: undefined,
        };

        assertAddUpdateListStateEqual(
            newAddUpdateListState,
            expectedNewAddUpdateListState
        );
    });

    it("updates position", () => {
        const newAddUpdateListState: AddUpdateListState = addUpdateListReducer(
            addUpdateListState,
            new UpdatePosition("top")
        );

        const expectedNewAddUpdateListState: AddUpdateListState = {
            ...addUpdateListState,
            position: "top",
            error: undefined,
        };

        assertAddUpdateListStateEqual(
            newAddUpdateListState,
            expectedNewAddUpdateListState
        );
    });

    it("updates default new item position", () => {
        const newAddUpdateListState: AddUpdateListState = addUpdateListReducer(
            addUpdateListState,
            new UpdateDefaultNewItemPosition("top")
        );

        const expectedNewAddUpdateListState: AddUpdateListState = {
            ...addUpdateListState,
            defaultNewItemPosition: "top",
            error: undefined,
        };

        assertAddUpdateListStateEqual(
            newAddUpdateListState,
            expectedNewAddUpdateListState
        );
    });

    it("updates error", () => {
        const oldState: AddUpdateListState = {
            ...addUpdateListState,
            error: undefined,
        };

        const newAddUpdateListState: AddUpdateListState = addUpdateListReducer(
            oldState,
            new UpdateError("Name must be provided")
        );

        const expectedNewAddUpdateListState: AddUpdateListState = {
            ...oldState,
            error: "Name must be provided",
        };

        assertAddUpdateListStateEqual(
            newAddUpdateListState,
            expectedNewAddUpdateListState
        );
    });
});
