import { insertAt, removeAt, updateAt, updateCollection } from "../utils";

describe("utils", () => {
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

            it("throws error with invalid position", () => {
                expect(() =>
                    updateCollection("A", letters, 0, "other")
                ).toThrowError(
                    "From updateCollection in utils.ts: Invalid position: other"
                );
            });
        });
    });
});
