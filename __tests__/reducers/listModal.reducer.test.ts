import { UpdateError } from "../../data/reducers/common";
import {
    ListModalState,
    UpdateDefaultNewItemPosition,
    UpdateListType,
    UpdateName,
    UpdatePosition,
    listModalReducer,
} from "../../data/reducers/listModal.reducer";
import { assertListModalStateEqual } from "../testUtils";

describe("list modal reducer", () => {
    const listModalState: ListModalState = {
        name: "My List",
        listType: "Shopping",
        defaultNewItemPosition: "bottom",
        position: "bottom",
        error: "Name must be provided", // Setting the error tests it is reset when other values are updated.
    };

    it("updates name", () => {
        const newListModalState: ListModalState = listModalReducer(
            listModalState,
            new UpdateName("My Updated List")
        );

        const expectedNewListModalState: ListModalState = {
            name: "My Updated List",
            listType: "Shopping",
            defaultNewItemPosition: "bottom",
            position: "bottom",
        };

        assertListModalStateEqual(newListModalState, expectedNewListModalState);
    });

    it("updates list type", () => {
        const newListModalState: ListModalState = listModalReducer(
            listModalState,
            new UpdateListType("Ordered To-Do")
        );

        const expectedNewListModalState: ListModalState = {
            name: "My List",
            listType: "Ordered To-Do",
            defaultNewItemPosition: "bottom",
            position: "bottom",
        };

        assertListModalStateEqual(newListModalState, expectedNewListModalState);
    });

    it("updates position", () => {
        const newListModalState: ListModalState = listModalReducer(
            listModalState,
            new UpdatePosition("top")
        );

        const expectedNewListModalState: ListModalState = {
            name: "My List",
            listType: "Shopping",
            defaultNewItemPosition: "bottom",
            position: "top",
        };

        assertListModalStateEqual(newListModalState, expectedNewListModalState);
    });

    it("updates default new item position", () => {
        const newListModalState: ListModalState = listModalReducer(
            listModalState,
            new UpdateDefaultNewItemPosition("top")
        );

        const expectedNewListModalState: ListModalState = {
            name: "My List",
            listType: "Shopping",
            defaultNewItemPosition: "top",
            position: "bottom",
        };

        assertListModalStateEqual(newListModalState, expectedNewListModalState);
    });

    it("updates error", () => {
        const newListModalState: ListModalState = listModalReducer(
            listModalState,
            new UpdateError("Name must be provided")
        );

        const expectedNewListModalState: ListModalState = {
            name: "My List",
            listType: "Shopping",
            defaultNewItemPosition: "bottom",
            position: "bottom",
            error: "Name must be provided",
        };

        assertListModalStateEqual(newListModalState, expectedNewListModalState);
    });
});
