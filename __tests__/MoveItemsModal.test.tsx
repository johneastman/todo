import { act, fireEvent, render, screen } from "@testing-library/react-native";
import MoveItemsModal from "../components/MoveItemsModal";
import { Item, List } from "../data/data";
import { AppAction, AppData, AppDataContext } from "../types";
import { AppContext, defaultSettings } from "../contexts/app.context";

describe("<MoveItemsModal />", () => {
    it("when source list is selected", async () => {
        const lists: List[] = [new List("A", "List", "bottom")];
        moveItemsModalFactory(lists);

        await act(() =>
            fireEvent.press(screen.getByTestId("custom-modal-Copy"))
        );

        expect(
            screen.getByText("A source list must be selected")
        ).not.toBeNull();
    });

    it("when destination list is not selected", async () => {
        const lists: List[] = [
            new List("A", "List", "bottom", [new Item("A-1", 1, false, true)]),
        ];
        moveItemsModalFactory(lists);

        await act(() =>
            fireEvent.press(screen.getByTestId("custom-modal-Copy"))
        );

        expect(
            screen.getByText("A destination list must be selected")
        ).not.toBeNull();
    });

    describe("Partition lists into source and destination", () => {
        /**
         * Even if the current list has no items, we should still be able to move/copy
         * items from other lists.
         */
        it("current list contains no items and other lists contains items", () => {
            const lists: List[] = [
                new List("A", "List", "bottom"),
                new List("B", "Ordered To-Do", "top", [
                    new Item("1", 1, false),
                ]),
                new List("C", "Shopping", "bottom", [new Item("1", 1, false)]),
            ];
            moveItemsModalFactory(lists);

            expect(screen.queryByTestId("Select source list-B")).not.toBeNull();
            expect(screen.queryByTestId("Select source list-C")).not.toBeNull();
        });

        /**
         * Move/copy only works on selected items in the current list, so even though there are
         * items in the current list, none are selected, so we can still only move/copy items
         * from other lists.
         */
        it("current list contains unselected items and other lists contains items", () => {
            const lists: List[] = [
                new List("A", "List", "bottom", [new Item("1", 1, false)]),
                new List("B", "Ordered To-Do", "top", [
                    new Item("1", 1, false),
                ]),
                new List("C", "Shopping", "bottom", [new Item("1", 1, false)]),
            ];
            moveItemsModalFactory(lists);

            expect(screen.queryByTestId("Select source list-B")).not.toBeNull();
            expect(screen.queryByTestId("Select source list-C")).not.toBeNull();
        });

        /**
         * For the source list, display:
         *   1. Current list because it contains selected items
         *   2. "B" because it contains items
         *   3. NOT "C" because it contains no iems
         *
         * For the destination list, display "B" and "C" because neither are the current list.
         */
        it("current list contains selected items and other lists contains items", () => {
            const lists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("1", 1, false, true),
                ]),
                new List("B", "Ordered To-Do", "top", [
                    new Item("1", 1, false),
                ]),
                new List("C", "Shopping", "bottom"),
            ];
            moveItemsModalFactory(lists);

            expect(
                screen.queryByTestId("Select source list-Current List")
            ).not.toBeNull();
            expect(screen.queryByTestId("Select source list-B")).not.toBeNull();

            expect(
                screen.queryByTestId("Select destination list-B")
            ).not.toBeNull();
            expect(
                screen.queryByTestId("Select destination list-C")
            ).not.toBeNull();
        });
    });
});

function moveItemsModalFactory(lists: List[]): void {
    const appData: AppData = {
        settings: defaultSettings,
        lists: lists,
        listsState: {
            isModalVisible: false,
            isDeleteAllModalVisible: false,
            currentIndex: -1,
        },
        itemsState: {
            isModalVisible: false,
            currentIndex: -1,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
    };

    const appState: AppDataContext = {
        data: appData,
        dispatch: (action: AppAction) => {
            throw Error(
                "Dispatch method in MoveItemsModal.test.tsx is not implemented"
            );
        },
    };

    render(
        <AppContext.Provider value={appState}>
            <MoveItemsModal
                listIndex={0}
                isVisible={true}
                setIsVisible={jest.fn()}
            />
        </AppContext.Provider>
    );
}
