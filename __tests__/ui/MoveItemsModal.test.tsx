import { act, fireEvent, render, screen } from "@testing-library/react-native";
import MoveItemsModal from "../../components/MoveItemsModal";
import { Item, List } from "../../data/data";
import { ListsContextData } from "../../types";
import { ListsContext, defaultListsData } from "../../contexts/lists.context";
import { ListsAction, ListsData } from "../../data/reducers/lists.reducer";

describe("<MoveItemsModal />", () => {
    it("when destination list is not selected", async () => {
        const lists: List[] = [
            new List("A", "List", "bottom", [
                new Item("A-1", "", 1, false, true),
            ]),
        ];
        moveItemsModalFactory(lists);

        await act(() =>
            fireEvent.press(screen.getByTestId("custom-modal-Copy"))
        );

        expect(
            screen.getByText("A destination list must be selected")
        ).not.toBeNull();
    });

    it("doesn't display current list in destination lists dropdown", () => {
        const lists: List[] = [
            new List("A", "List", "bottom"),
            new List("B", "Ordered To-Do", "top", [
                new Item("1", "", 1, false),
            ]),
            new List("C", "Shopping", "bottom", [new Item("1", "", 1, false)]),
        ];
        moveItemsModalFactory(lists);

        expect(screen.queryByTestId("Select destination list-A")).toBeNull();
        expect(
            screen.queryByTestId("Select destination list-B")
        ).not.toBeNull();
        expect(
            screen.queryByTestId("Select destination list-C")
        ).not.toBeNull();
    });
});

function moveItemsModalFactory(lists: List[]): void {
    const listsData: ListsData = { ...defaultListsData, lists: lists };

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: (action: ListsAction) => {
            throw Error(
                "Dispatch method in MoveItemsModal.test.tsx is not implemented"
            );
        },
    };

    render(
        <ListsContext.Provider value={listsContextData}>
            <MoveItemsModal
                currentListIndex={0}
                isVisible={true}
                setIsVisible={jest.fn()}
            />
        </ListsContext.Provider>
    );
}
