import { Item, List } from "../data/data";
import {
    getIndexOfItemBeingEdited,
    itemsCountDisplay,
    listsCountDisplay,
    pluralize,
    isAllSelected,
} from "../utils";

describe("utils", () => {
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
            const lists: List[] = [
                new List("0", "List 1", "List", "bottom", []),
                new List("1", "List 2", "List", "bottom", [], true),
            ];

            const selectedIndex: number = getIndexOfItemBeingEdited(lists);
            expect(selectedIndex).toEqual(1);
        });

        it("returns selected item", () => {
            const items: Item[] = [
                new Item("Item 1", 1, false),
                new Item("Item 2", 1, false, true),
            ];

            const selectedIndex: number = getIndexOfItemBeingEdited(items);
            expect(selectedIndex).toEqual(1);
        });

        it("returns -1 when no items are selected", () => {
            const items: Item[] = [
                new Item("Item 1", 1, false),
                new Item("Item 2", 1, false),
            ];

            const selectedIndex: number = getIndexOfItemBeingEdited(items);
            expect(selectedIndex).toEqual(-1);
        });
    });

    describe("isAllSelected", () => {
        describe("lists", () => {
            const notAllItemsSelected: List[] = [
                new List("0", "List 1", "List", "bottom", []),
                new List("1", "List 2", "List", "bottom", [], true),
            ];

            const allItemsSelected: List[] = [
                new List("0", "List 1", "List", "bottom", [], true),
                new List("1", "List 2", "List", "bottom", [], true),
            ];

            it("is all selected", () => {
                const actualIsAllSelected = isAllSelected(allItemsSelected);
                expect(actualIsAllSelected).toEqual(true);
            });

            it("is not all selected", () => {
                const actualIsAllSelected = isAllSelected(notAllItemsSelected);
                expect(actualIsAllSelected).toEqual(false);
            });
        });

        describe("items", () => {
            const notAllItemsSelected: Item[] = [
                new Item("Item 1", 1, false),
                new Item("Item 2", 1, false, true),
            ];

            const allItemsSelected: Item[] = [
                new Item("Item 1", 1, false, true),
                new Item("Item 2", 1, false, true),
            ];

            it("is all selected", () => {
                const actualIsAllSelected = isAllSelected(allItemsSelected);
                expect(actualIsAllSelected).toEqual(true);
            });

            it("is not all selected", () => {
                const actualIsAllSelected = isAllSelected(notAllItemsSelected);
                expect(actualIsAllSelected).toEqual(false);
            });
        });
    });
});
