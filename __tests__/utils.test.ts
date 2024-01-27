import { Item, List } from "../data/data";
import {
    cellsCountDisplay,
    getCellBeingEdited,
    insertAt,
    removeAt,
    updateAt,
    updateCollection,
} from "../utils";

describe("utils", () => {
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
                        new List("0", "A", "List", "bottom"),
                        new List("0", "B", "List", "bottom"),
                        new List("0", "C", "List", "bottom"),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(-1);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(-1);
                });
            });

            describe("when a cell is selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        new List("0", "A", "List", "bottom"),
                        new List("0", "B", "List", "bottom"),
                        new List("0", "C", "List", "bottom", [], true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(2);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false, true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(2);
                });
            });

            describe("returns the first cell when multiple are selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        new List("0", "A", "List", "bottom", [], true),
                        new List("0", "B", "List", "bottom"),
                        new List("0", "C", "List", "bottom", [], true),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(0);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", 1, "Item", false, true),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false, true),
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

        describe("updateCollection", () => {
            it("moves item from start to end", () => {
                const newLetters: string[] = updateCollection(
                    "A",
                    letters,
                    0,
                    "bottom"
                );
                expect(newLetters).toEqual(["B", "C", "D", "E", "A"]);
            });

            it("moves item from end to start", () => {
                const newLetters: string[] = updateCollection(
                    "E",
                    letters,
                    letters.length - 1,
                    "top"
                );
                expect(newLetters).toEqual(["E", "A", "B", "C", "D"]);
            });

            it("moves an item from the middle to the top", () => {
                const newLetters: string[] = updateCollection(
                    "C",
                    letters,
                    2,
                    "top"
                );
                expect(newLetters).toEqual(["C", "A", "B", "D", "E"]);
            });

            it("moves an item from the middle to the bottom", () => {
                const newLetters: string[] = updateCollection(
                    "C",
                    letters,
                    2,
                    "bottom"
                );
                expect(newLetters).toEqual(["A", "B", "D", "E", "C"]);
            });

            it("replaces item in middle", () => {
                const newLetters: string[] = updateCollection(
                    "F",
                    letters,
                    2,
                    "current"
                );
                expect(newLetters).toEqual(["A", "B", "F", "D", "E"]);
            });
        });
    });
});
