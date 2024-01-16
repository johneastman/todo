import { Item, List } from "../data/data";
import {
    getIndexOfItemBeingEdited,
    itemsCountDisplay,
    listsCountDisplay,
    pluralize,
    isAllSelected,
    getSelectedCells,
    areTestsRunning,
    selectedListCellsWording,
    getNumItemsTotal,
    getNumItemsIncomplete,
    updateCollection,
    removeAt,
    updateAt,
    insertAt,
    displayBoolean,
} from "../utils";

describe("utils", () => {
    // Lists
    const noListsSelected: List[] = [
        new List("0", "List 1", "List", "bottom", []),
        new List("1", "List 2", "List", "bottom", []),
    ];

    const someListsSelected: List[] = [
        new List("0", "List 1", "List", "bottom", []),
        new List("1", "List 2", "List", "bottom", [], true),
    ];

    const allListsSelected: List[] = [
        new List("0", "List 1", "List", "bottom", [], true),
        new List("1", "List 2", "List", "bottom", [], true),
    ];

    // Items
    const noItemsSelected: Item[] = [
        new Item("Item 1", 1, false),
        new Item("Item 2", 1, false),
    ];

    const someItemsSelected: Item[] = [
        new Item("Item 1", 1, false),
        new Item("Item 2", 1, false, true),
    ];

    const allItemsSelected: Item[] = [
        new Item("Item 1", 1, false, true),
        new Item("Item 2", 1, false, true),
    ];

    describe("pluralize", () => {
        it("returns plural when value is zero", () => {
            const actualResult: string = pluralize(0, "Item", "Items");
            expect(actualResult).toEqual("Items");
        });

        it("returns plural when value is greater than one", () => {
            const actualResult: string = pluralize(2, "Item", "Items");
            expect(actualResult).toEqual("Items");
        });

        it("returns singular when value is one", () => {
            const actualResult: string = pluralize(1, "Item", "Items");
            expect(actualResult).toEqual("Item");
        });
    });

    describe("itemsCountDisplay", () => {
        it("returns plural when value is zero", () => {
            const actualResult: string = itemsCountDisplay(0);
            expect(actualResult).toEqual("0 items");
        });

        it("returns plural when value is greater than one", () => {
            const actualResult: string = itemsCountDisplay(2);
            expect(actualResult).toEqual("2 items");
        });

        it("returns singular when value is one", () => {
            const actualResult: string = itemsCountDisplay(1);
            expect(actualResult).toEqual("1 item");
        });
    });

    describe("listsCountDisplay", () => {
        it("returns plural when value is zero", () => {
            const actualResult: string = listsCountDisplay(0);
            expect(actualResult).toEqual("0 lists");
        });

        it("returns plural when value is greater than one", () => {
            const actualResult: string = listsCountDisplay(2);
            expect(actualResult).toEqual("2 lists");
        });

        it("returns singular when value is one", () => {
            const actualResult: string = listsCountDisplay(1);
            expect(actualResult).toEqual("1 list");
        });
    });

    describe("getIndexOfItemBeingEdited", () => {
        it("returns selected list", () => {
            const selectedIndex: number =
                getIndexOfItemBeingEdited(someListsSelected);
            expect(selectedIndex).toEqual(1);
        });

        it("returns selected item", () => {
            const selectedIndex: number =
                getIndexOfItemBeingEdited(someItemsSelected);
            expect(selectedIndex).toEqual(1);
        });

        it("returns -1 when no items are selected", () => {
            const selectedIndex: number =
                getIndexOfItemBeingEdited(noItemsSelected);
            expect(selectedIndex).toEqual(-1);
        });
    });

    describe("isAllSelected", () => {
        it("when all are selected", () => {
            // Lists
            expect(isAllSelected(allListsSelected)).toEqual(true);

            // Items
            expect(isAllSelected(allItemsSelected)).toEqual(true);
        });

        it("when some are selected", () => {
            // Lists
            expect(isAllSelected(someListsSelected)).toEqual(false);

            // Items
            expect(isAllSelected(someItemsSelected)).toEqual(false);
        });

        it("when none are selected", () => {
            // Lists
            expect(isAllSelected(noListsSelected)).toEqual(false);

            // Items
            expect(isAllSelected(noItemsSelected)).toEqual(false);
        });
    });

    /**
     * Generic utilities for interacting with lists of any type of element.
     */
    describe("collection utils", () => {
        const numbers: number[] = [1, 2, 3, 4, 5];
        const newValue: number = 10;

        describe("insertAt", () => {
            it("inserts at beginning", () => {
                const newNumbers: number[] = insertAt(0, newValue, numbers);
                expect(newNumbers).toEqual([newValue, 1, 2, 3, 4, 5]);
            });

            it("inserts at end", () => {
                const newNumbers: number[] = insertAt(5, newValue, numbers);
                expect(newNumbers).toEqual([1, 2, 3, 4, 5, newValue]);
            });

            it("inserts in middle", () => {
                const newNumbers: number[] = insertAt(2, newValue, numbers);
                expect(newNumbers).toEqual([1, 2, newValue, 3, 4, 5]);
            });

            it("inserts near end", () => {
                const newNumbers: number[] = insertAt(4, newValue, numbers);
                expect(newNumbers).toEqual([1, 2, 3, 4, newValue, 5]);
            });
        });

        describe("updateAt", () => {
            it("updates first element", () => {
                const newNumbers: number[] = updateAt(0, newValue, numbers);
                expect(newNumbers).toEqual([newValue, 2, 3, 4, 5]);
            });

            it("updates last element", () => {
                const newNumbers: number[] = updateAt(4, newValue, numbers);
                expect(newNumbers).toEqual([1, 2, 3, 4, newValue]);
            });

            it("updates middle element", () => {
                const newNumbers: number[] = updateAt(2, newValue, numbers);
                expect(newNumbers).toEqual([1, 2, newValue, 4, 5]);
            });
        });

        describe("removeAt", () => {
            it("removes first element", () => {
                const newNumbers: number[] = removeAt(0, numbers);
                expect(newNumbers).toEqual([2, 3, 4, 5]);
            });

            it("removes last element", () => {
                const newNumbers: number[] = removeAt(4, numbers);
                expect(newNumbers).toEqual([1, 2, 3, 4]);
            });

            it("removes middle element", () => {
                const newNumbers: number[] = removeAt(2, numbers);
                expect(newNumbers).toEqual([1, 2, 4, 5]);
            });
        });

        describe("updateCollection", () => {
            it("moves item from bottom to top", () => {
                const newNumbers: number[] = updateCollection(
                    5,
                    numbers,
                    4,
                    "top"
                );
                expect(newNumbers).toEqual([5, 1, 2, 3, 4]);
            });

            it("moved item from top to bottom", () => {
                const newNumbers: number[] = updateCollection(
                    1,
                    numbers,
                    0,
                    "bottom"
                );
                expect(newNumbers).toEqual([2, 3, 4, 5, 1]);
            });

            it("moves item to current position", () => {
                const newNumbers: number[] = updateCollection(
                    3,
                    numbers,
                    2,
                    "current"
                );
                expect(newNumbers).toEqual([1, 2, 3, 4, 5]);
            });

            it("moves to invalid position", () => {
                expect(() =>
                    updateCollection(1, numbers, 0, "other")
                ).toThrowError(
                    "From updateCollection in utils.ts: Invalid position: other"
                );
            });
        });
    });

    describe("getNumItemsIncomplete", () => {
        const shoppingItems: Item[] = [
            new Item("Carrots", 2, false),
            new Item("Celery", 1, true),
            new Item("Garlic", 1, false),
        ];

        it("Shopping", () => {
            const numItems: number = getNumItemsIncomplete(
                "Shopping",
                shoppingItems
            );
            expect(numItems).toEqual(3);
        });

        it("List", () => {
            const numItems: number = getNumItemsIncomplete(
                "List",
                shoppingItems
            );
            expect(numItems).toEqual(2);
        });

        it("To-Do", () => {
            const numItems: number = getNumItemsIncomplete(
                "To-Do",
                shoppingItems
            );
            expect(numItems).toEqual(2);
        });

        it("Ordered To-Do", () => {
            const numItems: number = getNumItemsIncomplete(
                "Ordered To-Do",
                shoppingItems
            );
            expect(numItems).toEqual(2);
        });
    });

    describe("getNumItemsTotal", () => {
        const shoppingItems: Item[] = [
            new Item("Carrots", 2, false),
            new Item("Celery", 1, false),
            new Item("Garlic", 1, false),
        ];

        it("Shopping", () => {
            const numItems: number = getNumItemsTotal(
                "Shopping",
                shoppingItems
            );
            expect(numItems).toEqual(4);
        });

        it("List", () => {
            const numItems: number = getNumItemsTotal("List", shoppingItems);
            expect(numItems).toEqual(3);
        });

        it("To-Do", () => {
            const numItems: number = getNumItemsTotal("To-Do", shoppingItems);
            expect(numItems).toEqual(3);
        });

        it("Ordered To-Do", () => {
            const numItems: number = getNumItemsTotal(
                "Ordered To-Do",
                shoppingItems
            );
            expect(numItems).toEqual(3);
        });
    });

    describe("selectedListCellsWording", () => {
        it("when none are selected", () => {
            // List
            const listWord: string = selectedListCellsWording(noListsSelected);
            expect(listWord).toEqual("All");

            // Item
            const itemWord: string = selectedListCellsWording(noItemsSelected);
            expect(itemWord).toEqual("All");
        });

        it("when some are selected", () => {
            // List
            const listWord: string =
                selectedListCellsWording(someListsSelected);
            expect(listWord).toEqual("Selected");

            // Item
            const itemWord: string =
                selectedListCellsWording(someItemsSelected);
            expect(itemWord).toEqual("Selected");
        });

        it("when all are selected", () => {
            // List
            const listWord: string = selectedListCellsWording(allListsSelected);
            expect(listWord).toEqual("Selected");

            // Item
            const itemWord: string = selectedListCellsWording(allItemsSelected);
            expect(itemWord).toEqual("Selected");
        });
    });

    describe("getSelectedCells", () => {
        describe("retrieve selected cells", () => {
            test("no lists are selected", () => {
                // Lists
                const { cells: lists, areAnySelected: areListsSelected } =
                    getSelectedCells(noListsSelected);

                expect(areListsSelected).toEqual(false);
                expect(lists.length).toEqual(noListsSelected.length);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(noItemsSelected);

                expect(areItemsSelected).toEqual(false);
                expect(items.length).toEqual(noItemsSelected.length);
            });

            test("one list is selected", () => {
                // Lists
                const { cells: lists, areAnySelected: areListsSelected } =
                    getSelectedCells(someListsSelected);

                expect(areListsSelected).toEqual(true);
                expect(lists.length).toEqual(1);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(someItemsSelected);

                expect(areItemsSelected).toEqual(true);
                expect(items.length).toEqual(1);
            });

            test("all lists are selected", () => {
                // Lists
                const { cells: lists, areAnySelected: areListsSelected } =
                    getSelectedCells(allListsSelected);

                expect(areListsSelected).toEqual(true);
                expect(lists.length).toEqual(allListsSelected.length);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(allItemsSelected);

                expect(areItemsSelected).toEqual(true);
                expect(items.length).toEqual(allItemsSelected.length);
            });
        });

        describe("retrieve unselected items", () => {
            test("no lists are selected", () => {
                // Lists
                const { cells: lists, areAnySelected: areListsSelected } =
                    getSelectedCells(noListsSelected, false);
                expect(areListsSelected).toEqual(false);
                expect(lists.length).toEqual(0);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(noItemsSelected, false);
                expect(areItemsSelected).toEqual(false);
                expect(items.length).toEqual(0);
            });

            test("one list is selected", () => {
                // Lists
                const { cells: lists, areAnySelected: areListsSelected } =
                    getSelectedCells(someListsSelected, false);
                expect(areListsSelected).toEqual(true);
                expect(lists.length).toEqual(1);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(someItemsSelected, false);
                expect(areItemsSelected).toEqual(true);
                expect(items.length).toEqual(1);
            });

            test("all lists are selected", () => {
                // Lists
                const { cells: lists, areAnySelected: areListsSelected } =
                    getSelectedCells(allListsSelected, false);
                expect(areListsSelected).toEqual(true);
                expect(lists.length).toEqual(0);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(allItemsSelected, false);
                expect(areItemsSelected).toEqual(true);
                expect(items.length).toEqual(0);
            });
        });
    });

    describe("areTestsRunning", () => {
        it("when tests are running", () => {
            expect(areTestsRunning()).toEqual(true);
        });
    });

    describe("displayBoolean", () => {
        it("is true", () => {
            expect(displayBoolean(true)).toEqual("True");
        });

        it("is false", () => {
            expect(displayBoolean(false)).toEqual("False");
        });
    });
});
