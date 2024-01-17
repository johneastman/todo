import {
    UpdatePosition,
    UpdateQuantity,
    UpdateText,
    UpdateType,
    itemModalReducer,
} from "../../data/reducers/itemModalReducer";
import { ItemCRUD } from "../../types";

describe("itemModalReducer", () => {
    const state: ItemCRUD = {
        name: "My Item",
        quantity: 1,
        isComplete: false,
        oldPosition: 0,
        newPosition: "current",
        type: "Item",
    };

    it("updates text", () => {
        const newState: ItemCRUD = itemModalReducer(
            state,
            new UpdateText("My NEW Item")
        );

        const { name, quantity, isComplete, oldPosition, newPosition, type } =
            newState;

        expect(name).toEqual("My NEW Item");
        expect(quantity).toEqual(1);
        expect(isComplete).toEqual(false);
        expect(oldPosition).toEqual(0);
        expect(newPosition).toEqual("current");
        expect(type).toEqual("Item");
    });

    it("updates quantity", () => {
        const newState: ItemCRUD = itemModalReducer(
            state,
            new UpdateQuantity(100)
        );

        const { name, quantity, isComplete, oldPosition, newPosition, type } =
            newState;

        expect(name).toEqual("My Item");
        expect(quantity).toEqual(100);
        expect(isComplete).toEqual(false);
        expect(oldPosition).toEqual(0);
        expect(newPosition).toEqual("current");
        expect(type).toEqual("Item");
    });

    it("updates position", () => {
        const newState: ItemCRUD = itemModalReducer(
            state,
            new UpdatePosition("top")
        );

        const { name, quantity, isComplete, oldPosition, newPosition, type } =
            newState;

        expect(name).toEqual("My Item");
        expect(quantity).toEqual(1);
        expect(isComplete).toEqual(false);
        expect(oldPosition).toEqual(0);
        expect(newPosition).toEqual("top");
        expect(type).toEqual("Item");
    });

    it("updates type", () => {
        const newState: ItemCRUD = itemModalReducer(
            state,
            new UpdateType("Section")
        );

        const { name, quantity, isComplete, oldPosition, newPosition, type } =
            newState;

        expect(name).toEqual("My Item");
        expect(quantity).toEqual(1);
        expect(isComplete).toEqual(false);
        expect(oldPosition).toEqual(0);
        expect(newPosition).toEqual("current");
        expect(type).toEqual("Section");
    });
});
