import { screen, fireEvent, act } from "@testing-library/react-native";
import MoveItemsModal from "../components/MoveItemsModal";
import { COPY, Item, List, MOVE } from "../data/data";
import { TIMEOUT_MS, renderComponent } from "./testUtils";
import { MoveItemAction, SelectionValue } from "../types";

type ListTypeJest = "current" | "other";

const mockGetItems = jest.fn();
const mockSaveItems = jest.fn();
const mockSetItems = jest.fn();

jest.mock("../data/utils", () => {
    return {
        getItems: jest.fn((listId: string): Item[] => mockGetItems(listId)),
        saveItems: jest.fn((listId: string, items: Item[]) =>
            mockSaveItems(listId, items)
        ),
    };
});

const list0: List = new List("0", "List 0", "Shopping", "bottom", [
    new Item("A", 1, "Item", false),
    new Item("B", 1, "Item", false),
]);

const list1: List = new List("1", "List 1", "List", "top", [
    new Item("C", 1, "Item", false),
]);

const list2: List = new List("2", "List 2", "Ordered To-Do", "bottom", [
    new Item("A", 1, "Item", false),
    new Item("B", 1, "Item", false, true),
    new Item("C", 1, "Item", false),
    new Item("D", 1, "Item", false, true),
    new Item("E", 1, "Item", false, true),
]);

/**
 * Because assertions are happening in the mocked methods (setItems, saveItems, etc.), those method
 * have to be called *before* the render method and test logic so the mocked method is setup.
 */
describe("<MoveItemsModal />", () => {
    beforeEach(() => {
        mockGetItems.mockReset();
        mockSaveItems.mockReset();
        mockSetItems.mockReset();
    });

    describe("Copy Workflow", () => {
        it(
            "copies items from the current list into another list",
            async () => {
                const currentListAfter: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [
                        new Item("C", 1, "Item", false),
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                assertNewCurrentList(currentListAfter);
                assertNewOtherList(otherListAfter);

                const currentListBefore: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                const otherListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(COPY, "Current List", otherListBefore.name);
            },
            TIMEOUT_MS
        );

        it(
            "copies items from other list into current list",
            async () => {
                const currentListAfter: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                assertNewCurrentList(currentListAfter);
                assertNewOtherList(otherListAfter);

                const currentListBefore: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                const otherListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(COPY, list1.name);
            },
            TIMEOUT_MS
        );

        it(
            "copies selected items from current list into other list",
            async () => {
                const currentListAfter: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                        new Item("E", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [
                        new Item("C", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                        new Item("E", 1, "Item", false),
                    ]
                );
                assertNewOtherList(otherListAfter);
                assertNewCurrentList(currentListAfter);

                const currentListBefore: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false, true),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false, true),
                        new Item("E", 1, "Item", false, true),
                    ]
                );

                const otherListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(COPY, "Current List", otherListBefore.name);
            },
            TIMEOUT_MS
        );

        it(
            "copies selected items in other list into current list (ignores selected in other list)",
            async () => {
                const currentListAfter: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("C", 1, "Item", false),
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                        new Item("E", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                        new Item("E", 1, "Item", false),
                    ]
                );
                assertNewOtherList(otherListAfter);
                assertNewCurrentList(currentListAfter);

                const currentListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                const otherListBefore: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false, true),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false, true),
                        new Item("E", 1, "Item", false, true),
                    ]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(COPY, otherListBefore.name);
            },
            TIMEOUT_MS
        );
    });

    describe("Move Workflow", () => {
        it(
            "moves items from the current list into the other list",
            async () => {
                const currentListAfter: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    []
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [
                        new Item("C", 1, "Item", false),
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                assertNewCurrentList(currentListAfter);
                assertNewOtherList(otherListAfter);

                const currentListBefore: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                const otherListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(MOVE, "Current List", otherListBefore.name);
            },
            TIMEOUT_MS
        );

        it(
            "moves items from the other list into the current list",
            async () => {
                const currentListAfter: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    []
                );

                assertNewCurrentList(currentListAfter);
                assertNewOtherList(otherListAfter);

                const currentListBefore: List = new List(
                    "0",
                    "List 0",
                    "Shopping",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                    ]
                );

                const otherListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(MOVE, otherListBefore.name);
            },
            TIMEOUT_MS
        );

        it(
            "moves selected items from the current list into the other list",
            async () => {
                const currentListAfter: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [
                        new Item("C", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                        new Item("E", 1, "Item", false),
                    ]
                );
                assertNewOtherList(otherListAfter);
                assertNewCurrentList(currentListAfter);

                const currentListBefore: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false, true),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false, true),
                        new Item("E", 1, "Item", false, true),
                    ]
                );

                const otherListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(MOVE, "Current List", otherListBefore.name);
            },
            TIMEOUT_MS
        );

        it(
            "moves selected items from the other list into the current list (ignores selected in other list)",
            async () => {
                const currentListAfter: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("C", 1, "Item", false),
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                        new Item("E", 1, "Item", false),
                    ]
                );

                const otherListAfter: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    []
                );
                assertNewOtherList(otherListAfter);
                assertNewCurrentList(currentListAfter);

                const currentListBefore: List = new List(
                    "1",
                    "List 1",
                    "List",
                    "top",
                    [new Item("C", 1, "Item", false)]
                );

                const otherListBefore: List = new List(
                    "2",
                    "List 2",
                    "Ordered To-Do",
                    "bottom",
                    [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false, true),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false, true),
                        new Item("E", 1, "Item", false, true),
                    ]
                );

                await renderMoveItemModal(currentListBefore, otherListBefore);
                await copyItems(MOVE, otherListBefore.name);
            },
            TIMEOUT_MS
        );
    });
});

async function renderMoveItemModal(current: List, other: List): Promise<void> {
    const setIsVisible = jest.fn();

    setReturnValues(current, other);

    await renderComponent(
        <MoveItemsModal
            isVisible={true}
            setIsVisible={setIsVisible}
            currentList={current}
            otherLists={[other]}
            setItems={mockSetItems}
        />
    );
}

function setReturnValues(current: List, other: List): void {
    mockGetItems.mockImplementation((listId: string): Item[] => {
        const list: List = listId === current.id ? current : other;
        return list.items;
    });
}

function assertNewCurrentList(newCurrentList: List): void {
    // Assert changes to the current list
    mockSetItems.mockImplementation((items: Item[]): void => {
        const expectedCurrentItems: Item[] = newCurrentList.items;

        expect(items.length).toEqual(expectedCurrentItems.length);
        for (let n = 0; n < expectedCurrentItems.length; n++) {
            expect(items[n]).toEqual(expectedCurrentItems[n]);
        }
    });
}

function assertNewOtherList(newOtherList: List): void {
    // Assert changes to the other list
    mockSaveItems.mockImplementation((listId: string, items: Item[]) => {
        const expectedOtherItems: Item[] = newOtherList.items;

        expect(items.length).toEqual(expectedOtherItems.length);

        for (let n = 0; n < items.length; n++) {
            expect(items[n]).toEqual(expectedOtherItems[n]);
        }
    });
}

/**
 * Copy or move items from one list to another.
 *
 * @param sourceList name of list where items will be copied/moved from.
 * @param destinationList name of list where items will be copied/moved to. This parameter is optional
 * because when the user selects a source list that is not the current list, the destination list becomes
 * the source/current list by default.
 */
async function copyItems(
    action: SelectionValue<MoveItemAction>,
    sourceList: string,
    destinationList?: string
): Promise<void> {
    // Select Action
    await act(() =>
        fireEvent.press(screen.getByTestId(`no-title-${action.label}-testID`))
    );

    // Select source list
    await act(() =>
        fireEvent.press(
            screen.getByTestId(`Select source list-${sourceList}-testID`)
        )
    );

    // Select destination list.
    if (destinationList !== undefined) {
        await act(() =>
            fireEvent.press(
                screen.getByTestId(
                    `Select destination list-${destinationList}-testID`
                )
            )
        );
    }

    // Press Copy Button
    await act(() =>
        fireEvent.press(screen.getByTestId(`custom-modal-${action.value}`))
    );
}
