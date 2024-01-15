import { Item, List } from "../data/data";
import {
    getIndexOfItemBeingEdited,
    itemsCountDisplay,
    listsCountDisplay,
    pluralize,
    isAllSelected,
    getSelectedCells,
} from "../utils";

describe("utils", () => {
    const notAllListsSelected: List[] = [
        new List("0", "List 1", "List", "bottom", []),
        new List("1", "List 2", "List", "bottom", [], true),
    ];

    const allListsSelected: List[] = [
        new List("0", "List 1", "List", "bottom", [], true),
        new List("1", "List 2", "List", "bottom", [], true),
    ];

    const noListsSelected: List[] = [
        new List("0", "List 1", "List", "bottom", []),
        new List("1", "List 2", "List", "bottom", []),
    ];

    const notAllItemsSelected: Item[] = [
        new Item("Item 1", 1, false),
        new Item("Item 2", 1, false, true),
    ];

    const allItemsSelected: Item[] = [
        new Item("Item 1", 1, false, true),
        new Item("Item 2", 1, false, true),
    ];

    const noItemsSelected: Item[] = [
        new Item("Item 1", 1, false),
        new Item("Item 2", 1, false),
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
                getIndexOfItemBeingEdited(notAllListsSelected);
            expect(selectedIndex).toEqual(1);
        });

        it("returns selected item", () => {
            const selectedIndex: number =
                getIndexOfItemBeingEdited(notAllItemsSelected);
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
            expect(isAllSelected(notAllListsSelected)).toEqual(false);

            // Items
            expect(isAllSelected(notAllItemsSelected)).toEqual(false);
        });

        it("when none are selected", () => {
            // Lists
            expect(isAllSelected(noListsSelected)).toEqual(false);

            // Items
            expect(isAllSelected(noItemsSelected)).toEqual(false);
        });
    });

    describe("items", () => {
        it("is all selected", () => {});

        it("is not all selected", () => {
            const actualIsAllSelected = isAllSelected(notAllItemsSelected);
            expect(actualIsAllSelected).toEqual(false);
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
                    getSelectedCells(notAllListsSelected);

                expect(areListsSelected).toEqual(true);
                expect(lists.length).toEqual(1);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(notAllItemsSelected);

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
                    getSelectedCells(notAllListsSelected, false);
                expect(areListsSelected).toEqual(true);
                expect(lists.length).toEqual(1);

                // Items
                const { cells: items, areAnySelected: areItemsSelected } =
                    getSelectedCells(notAllItemsSelected, false);
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
});
