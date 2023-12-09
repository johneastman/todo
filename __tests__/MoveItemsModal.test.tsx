import { screen, fireEvent, act } from "@testing-library/react-native";
import MoveItemsModal from "../components/MoveItemsModal";
import { Item, List } from "../data/data";
import { renderComponent } from "./testUtils";
import { MoveItemAction } from "../types";

type ListTypeJest = "current" | "other";

const mockGetItems = jest.fn().mockImplementation(() => {
    throw new Error("failed");
});

const mockSaveItems = jest.fn().mockImplementation(() => {
    throw new Error("failed");
});

jest.mock("../data/utils", () => {
    return {
        getItems: jest.fn((listId: string): Item[] => mockGetItems(listId)),
        saveItems: jest.fn((listId: string, items: Item[]) =>
            mockSaveItems(listId, items)
        ),
    };
});

describe("<MoveItemsModal />", () => {
    const firstListItems: Item[] = [
        new Item("A", 1, false),
        new Item("B", 1, false),
    ];

    const secondListItems: Item[] = [new Item("C", 1, false)];

    const beforeItems: Map<ListTypeJest, Item[]> = new Map();
    const afterItems: Map<ListTypeJest, Item[]> = new Map();

    beforeEach(() => {
        mockGetItems.mockReset();
        mockSaveItems.mockReset();

        beforeItems.clear();
        afterItems.clear();
    });

    describe("Copy Workflow", () => {
        it("copies items from the current list into another list", async () => {
            beforeItems.set("current", firstListItems);
            beforeItems.set("other", secondListItems);
            setReturnValues(beforeItems);

            afterItems.set("current", firstListItems);
            afterItems.set("other", secondListItems.concat(firstListItems));
            await assertNewListsCorrect(afterItems);

            await copyItems("copy", "Current List", "List 1");
        });

        it("copies items from other list into current list", async () => {
            beforeItems.set("current", secondListItems);
            beforeItems.set("other", firstListItems);
            setReturnValues(beforeItems);

            afterItems.set("current", secondListItems.concat(firstListItems));
            afterItems.set("other", secondListItems);
            await assertNewListsCorrect(afterItems);

            await copyItems("copy", "List 1");
        });

        it("copies selected items from current list into other list", async () => {
            const currentItems: Item[] = [
                new Item("A", 1, false),
                new Item("B", 1, false, true),
                new Item("C", 1, false),
                new Item("D", 1, false, true),
                new Item("E", 1, false, true),
            ];
            beforeItems.set("current", currentItems);
            beforeItems.set("other", secondListItems);
            setReturnValues(beforeItems);

            afterItems.set(
                "current",
                currentItems.map((i) => i.setIsSelected(false))
            );
            afterItems.set(
                "other",
                secondListItems.concat([
                    new Item("B", 1, false),
                    new Item("D", 1, false),
                    new Item("E", 1, false),
                ])
            );
            await assertNewListsCorrect(afterItems);

            await copyItems("copy", "Current List", "List 1");
        });

        it("copies selected items in other list into current list (ignores selected in other list)", async () => {
            const otherListItems: Item[] = [
                new Item("A", 1, false),
                new Item("B", 1, false, true),
                new Item("C", 1, false),
                new Item("D", 1, false, true),
                new Item("E", 1, false, true),
            ];
            beforeItems.set("current", secondListItems);
            beforeItems.set("other", otherListItems);
            setReturnValues(beforeItems);

            afterItems.set(
                "current",
                secondListItems
                    .concat(otherListItems)
                    .map((i) => i.setIsSelected(false))
            );
            afterItems.set("other", otherListItems);
            await assertNewListsCorrect(afterItems);

            await copyItems("copy", "List 1");
        });
    });

    describe("Move Workflow", () => {
        it("moves items from the current list into the other list", async () => {
            beforeItems.set("current", firstListItems);
            beforeItems.set("other", secondListItems);
            setReturnValues(beforeItems);

            afterItems.set("current", []);
            afterItems.set("other", secondListItems.concat(firstListItems));
            await assertNewListsCorrect(afterItems);

            await copyItems("move", "Current List", "List 1");
        });

        it("moves items from the other list into the current list", async () => {
            beforeItems.set("current", secondListItems);
            beforeItems.set("other", firstListItems);
            setReturnValues(beforeItems);

            afterItems.set("current", secondListItems.concat(firstListItems));
            afterItems.set("other", []);
            await assertNewListsCorrect(afterItems);

            await copyItems("move", "List 1");
        });

        it("moves selected items from the current list into the other list", async () => {
            const currentItems: Item[] = [
                new Item("A", 1, false),
                new Item("B", 1, false, true),
                new Item("C", 1, false),
                new Item("D", 1, false, true),
                new Item("E", 1, false, true),
            ];
            beforeItems.set("current", currentItems);
            beforeItems.set("other", secondListItems);
            setReturnValues(beforeItems);

            afterItems.set("current", [
                new Item("A", 1, false),
                new Item("C", 1, false),
            ]);
            afterItems.set(
                "other",
                secondListItems.concat([
                    new Item("B", 1, false),
                    new Item("D", 1, false),
                    new Item("E", 1, false),
                ])
            );
            await assertNewListsCorrect(afterItems);

            await copyItems("move", "Current List", "List 1");
        });

        it("moves selected items from the other list into the current list (ignores selected in other list)", async () => {
            const otherListItems: Item[] = [
                new Item("A", 1, false),
                new Item("B", 1, false, true),
                new Item("C", 1, false),
                new Item("D", 1, false, true),
                new Item("E", 1, false, true),
            ];
            beforeItems.set("current", secondListItems);
            beforeItems.set("other", otherListItems);
            setReturnValues(beforeItems);

            afterItems.set(
                "current",
                secondListItems
                    .concat(otherListItems)
                    .map((i) => i.setIsSelected(false))
            );
            afterItems.set("other", []);
            await assertNewListsCorrect(afterItems);

            await copyItems("move", "List 1");
        });
    });
});

async function assertNewListsCorrect(
    listItemReturnValues: Map<ListTypeJest, Item[]>
    // currentListNewItems: Item[],
    // otherListNewItems: Item[]
): Promise<void> {
    const setIsVisible = jest.fn();
    const currentList: List = new List("0", "List 0", "Shopping", "current");
    const otherLists: List[] = [new List("1", "List 1", "Shopping", "current")];

    // Assert changes to the current list
    const setItems = jest.fn((items: Item[]): void => {
        const expectedCurrentItems: Item[] =
            listItemReturnValues.get("current") ?? [];

        expect(items.length).toEqual(expectedCurrentItems.length);
        expect(items).toEqual(expectedCurrentItems);
    });

    // Assert changes to the other list
    mockSaveItems.mockImplementation((listId: string, items: Item[]) => {
        const expectedOtherItems: Item[] =
            listItemReturnValues.get("other") ?? [];

        expect(items.length).toEqual(expectedOtherItems.length);
        expect(items).toEqual(expectedOtherItems);
    });

    await renderComponent(
        <MoveItemsModal
            isVisible={true}
            setIsVisible={setIsVisible}
            currentList={currentList}
            otherLists={otherLists}
            setItems={setItems}
        />
    );
}

function setReturnValues(
    listItemReturnValues: Map<ListTypeJest, Item[]>
): void {
    mockGetItems.mockImplementation((listId: string): Item[] => {
        const itemsKey: ListTypeJest = listId === "0" ? "current" : "other";
        return listItemReturnValues.get(itemsKey) ?? [];
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
    action: MoveItemAction,
    sourceList: string,
    destinationList?: string
): Promise<void> {
    // Select Action
    const actionDisplayName: string = action[0].toUpperCase() + action.slice(1);
    await act(() =>
        fireEvent.press(
            screen.getByTestId(`no-title-${actionDisplayName}-testID`)
        )
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
        fireEvent.press(screen.getByTestId(`custom-modal-${action}`))
    );
}
