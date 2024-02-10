import { Item, List } from "../data/data";
import {
    cellsCountDisplay,
    getCellBeingEdited,
    insertAt,
    partitionLists,
    pluralize,
    removeAt,
    updateAt,
} from "../utils";
import { assertListEqual, assertListsEqual } from "./testUtils";

describe("utils", () => {
    describe("pluralize", () => {
        it("is 0", () =>
            expect(pluralize(0, "Item", "Items")).toEqual("Items"));
        it("is 1", () => expect(pluralize(1, "Item", "Items")).toEqual("Item"));
        it("is 2", () =>
            expect(pluralize(2, "Item", "Items")).toEqual("Items"));
    });

    describe("partitionLists", () => {
        const lists: List[] = [
            new List("A", "List", "bottom"),
            new List("B", "List", "bottom"),
            new List("C", "List", "bottom"),
            new List("D", "List", "bottom"),
            new List("E", "List", "bottom"),
        ];
        it("when current list the first list", () => {
            const [currentList, otherLists] = partitionLists(0, lists);
            assertListEqual(currentList, new List("A", "List", "bottom"));
            assertListsEqual(otherLists, [
                new List("B", "List", "bottom"),
                new List("C", "List", "bottom"),
                new List("D", "List", "bottom"),
                new List("E", "List", "bottom"),
            ]);
        });

        it("when current list is the last list", () => {
            const [currentList, otherLists] = partitionLists(4, lists);
            assertListEqual(currentList, new List("E", "List", "bottom"));
            assertListsEqual(otherLists, [
                new List("A", "List", "bottom"),
                new List("B", "List", "bottom"),
                new List("C", "List", "bottom"),
                new List("D", "List", "bottom"),
            ]);
        });

        it("when current list is the middle list", () => {
            const [currentList, otherLists] = partitionLists(2, lists);
            assertListEqual(currentList, new List("C", "List", "bottom"));
            assertListsEqual(otherLists, [
                new List("A", "List", "bottom"),
                new List("B", "List", "bottom"),
                new List("D", "List", "bottom"),
                new List("E", "List", "bottom"),
            ]);
        });

        it("when index out of range", () => {
            expect(() => partitionLists(-1, lists)).toThrowError(
                "Index out of range: -1"
            );

            expect(() => partitionLists(lists.length, lists)).toThrowError(
                "Index out of range: 5"
            );
        });
    });

    describe("Cells helpers", () => {
        describe("cellsCountDisplay", () => {
            it("lists", () => {
                const listsLabel: string = cellsCountDisplay("List", 5);
                expect(listsLabel).toEqual("5 lists");
            });

            it("items", () => {
                const listsLabel: string = cellsCountDisplay("Item", 5);
                expect(listsLabel).toEqual("5 items");
            });
        });

        describe("getCellBeingEdited", () => {
            describe("when no cells are selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        new List("A", "List", "bottom"),
                        new List("B", "List", "bottom"),
                        new List("C", "List", "bottom"),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(-1);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", 1, false),
                        new Item("B", 1, false),
                        new Item("C", 1, false),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(-1);
                });
            });

            describe("when a cell is selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        new List("A", "List", "bottom"),
                        new List("B", "List", "bottom"),
                        new List("C", "List", "bottom", [], true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(2);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", 1, false),
                        new Item("B", 1, false),
                        new Item("C", 1, false, true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(2);
                });
            });

            describe("returns the first cell when multiple are selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        new List("A", "List", "bottom", [], true),
                        new List("B", "List", "bottom"),
                        new List("C", "List", "bottom", [], true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(0);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", 1, false, true),
                        new Item("B", 1, false),
                        new Item("C", 1, false, true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(0);
                });
            });
        });
    });

    describe("generic list helpers", () => {
        const letters: string[] = ["A", "B", "C", "D", "E"];

        describe("insertAt", () => {
            it("adds item to beginning", () => {
                const newLetters: string[] = insertAt(0, "F", letters);
                expect(newLetters).toEqual(["F", "A", "B", "C", "D", "E"]);
            });

            it("adds item at end", () => {
                const newLetters: string[] = insertAt(
                    letters.length,
                    "F",
                    letters
                );
                expect(newLetters).toEqual(["A", "B", "C", "D", "E", "F"]);
            });

            it("adds item in the middle end", () => {
                const newLetters: string[] = insertAt(2, "F", letters);
                expect(newLetters).toEqual(["A", "B", "F", "C", "D", "E"]);
            });
        });

        describe("removeAt", () => {
            it("removes first item", () => {
                const newLetters: string[] = removeAt(0, letters);
                expect(newLetters).toEqual(["B", "C", "D", "E"]);
            });

            it("removes last item", () => {
                const newLetters: string[] = removeAt(
                    letters.length - 1,
                    letters
                );
                expect(newLetters).toEqual(["A", "B", "C", "D"]);
            });

            it("removes item in middle", () => {
                const newLetters: string[] = removeAt(3, letters);
                expect(newLetters).toEqual(["A", "B", "C", "E"]);
            });
        });

        describe("updateAt", () => {
            it("updates item at beginning", () => {
                const newLetters: string[] = updateAt("F", letters, 0);
                expect(newLetters).toEqual(["F", "B", "C", "D", "E"]);
            });

            it("updates item at end", () => {
                const newLetters: string[] = updateAt(
                    "F",
                    letters,
                    letters.length - 1
                );
                expect(newLetters).toEqual(["A", "B", "C", "D", "F"]);
            });

            it("updates item in middle", () => {
                const newLetters: string[] = updateAt("F", letters, 2);
                expect(newLetters).toEqual(["A", "B", "F", "D", "E"]);
            });

            it("moves item", () => {
                const newLetters: string[] = updateAt("B", letters, 1, 3);
                expect(newLetters).toEqual(["A", "C", "D", "B", "E"]);
            });

            it("replaces and moves item", () => {
                const newLetters: string[] = updateAt("F", letters, 1, 3);
                expect(newLetters).toEqual(["A", "C", "D", "F", "E"]);
            });
        });
    });
});
