import { act, fireEvent, render, screen } from "@testing-library/react-native";
import MoveItemsModal from "../components/MoveItemsModal";
import { Item, List } from "../data/data";

describe("<MoveItemsModal />", () => {
    it("when source list is selected", async () => {
        const currentList: List = new List("0", "A", "List", "bottom");
        const otherLists: List[] = [];
        moveItemsModalFactory(currentList, otherLists);

        await act(() =>
            fireEvent.press(screen.getByTestId("custom-modal-Copy"))
        );

        expect(
            screen.getByText("A source list must be selected")
        ).not.toBeNull();
    });

    it("when destination list is not selected", async () => {
        const currentList: List = new List("0", "A", "List", "bottom", [
            new Item("A-1", 1, "Item", false, true),
        ]);
        const otherLists: List[] = [];
        moveItemsModalFactory(currentList, otherLists);

        await act(() =>
            fireEvent.press(screen.getByTestId("custom-modal-Copy"))
        );

        expect(
            screen.getByText("A destination list must be selected")
        ).not.toBeNull();
    });
});

function moveItemsModalFactory(currentList: List, otherLists: List[]): void {
    render(
        <MoveItemsModal
            isVisible={true}
            setIsVisible={jest.fn()}
            currentList={currentList}
            otherLists={otherLists}
        />
    );
}
