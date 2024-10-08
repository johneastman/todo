import { act, fireEvent, render, screen } from "@testing-library/react-native";
import MoveItemsModal from "../../components/MoveItemsModal";
import { Item, List } from "../../data/data";
import { ListsContextData } from "../../types";
import { ListsContext, defaultListsData } from "../../contexts/lists.context";
import { ListsAction, ListsData } from "../../data/reducers/lists.reducer";
import { itemIncomplete, listDefault } from "../testUtils";

describe("<MoveItemsModal />", () => {
    it("when destination list is not selected", async () => {
        const lists: List[] = [
            listDefault("A", "List", "bottom", [
                new Item("A-1", "", 1, { isComplete: false, isSelected: true }),
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

    it("doesn't display current list in destination lists dropdown", async () => {
        const lists: List[] = [
            listDefault("A", "List", "bottom"),
            listDefault("B", "Ordered To-Do", "top", [
                itemIncomplete("1", "", 1),
            ]),
            listDefault("C", "Shopping", "bottom", [
                itemIncomplete("1", "", 1),
            ]),
        ];
        moveItemsModalFactory(lists);

        // Open destination dropdown
        const moveItemsDropdownTestId: string =
            "move-items-modal-destination-dropdown";
        await act(() =>
            fireEvent.press(screen.getByTestId(moveItemsDropdownTestId))
        );

        expect(screen.queryByTestId(`${moveItemsDropdownTestId}-A`)).toBeNull();
        expect(
            screen.queryByTestId(`${moveItemsDropdownTestId}-B`)
        ).not.toBeNull();
        expect(
            screen.queryByTestId(`${moveItemsDropdownTestId}-C`)
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
