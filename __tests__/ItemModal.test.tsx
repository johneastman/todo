import { screen, fireEvent } from "@testing-library/react-native";

import ItemModal from "../components/ItemModal";
import { Item, List } from "../data/data";
import {
    getTextElementValue,
    getTextInputElementValue,
    renderComponent,
} from "./testUtils";
import { Position } from "../types";
import * as utils from "../data/utils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<ItemModal />", () => {
    let positiveAction = jest.fn();
    let negativeAction = jest.fn();

    it("adds new item", () => {
        renderComponent(
            itemModalFactory(undefined, positiveAction, negativeAction)
        );

        // Item name/text input
        let textInputValue = getTextInputElementValue(
            screen.getByTestId("ItemModal-item-name")
        );
        expect(textInputValue).toEqual("");

        // Quantity
        let quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("1");
    });

    it("updates item", () => {
        renderComponent(
            itemModalFactory(
                new Item("My item name", 5),
                positiveAction,
                negativeAction
            )
        );

        // Item name/text input
        let textInputValue = getTextInputElementValue(
            screen.getByTestId("ItemModal-item-name")
        );
        expect(textInputValue).toEqual("My item name");

        // Quantity
        let quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("5");
    });

    it("increments quantity", () => {
        renderComponent(
            itemModalFactory(undefined, positiveAction, negativeAction)
        );

        let quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("1");

        fireEvent.press(screen.getByText("+"));

        quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("2");
    });

    it("decrements quantity", () => {
        renderComponent(
            itemModalFactory(
                new Item("name", 3),
                positiveAction,
                negativeAction
            )
        );

        let quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );

        expect(quantityValue).toEqual("3");

        fireEvent.press(screen.getByText("-"));

        quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("2");

        fireEvent.press(screen.getByText("-"));

        // Test that pressing the decrement buttons, when the quantity is 1, does not decrement the quantiy anymore.
        quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("1");

        fireEvent.press(screen.getByText("-"));

        quantityValue = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("1");
    });

    it("dismisses add-item modal (presses cancel button))", () => {
        renderComponent(
            itemModalFactory(undefined, positiveAction, negativeAction)
        );

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });

    it("adds item (presses add button)", () => {
        renderComponent(
            itemModalFactory(undefined, positiveAction, negativeAction)
        );

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(1);
    });

    describe("move items", () => {
        const item: Item = new Item("Item", 1);

        it("does not show 'other'", async () => {
            mockAppData([]);

            await renderComponent(
                itemModalFactory(item, positiveAction, negativeAction)
            );

            expect(screen.queryByText("Top")).not.toBeNull();
            expect(screen.queryByText("Current Position")).not.toBeNull();
            expect(screen.queryByText("Bottom")).not.toBeNull();

            expect(screen.queryByText("Other")).toBeNull();
        });

        it("does show 'other'", async () => {
            mockAppData([
                new List("0", "List 1", "Shopping", "bottom"),
                new List("1", "List 2", "Shopping", "bottom"),
            ]);

            await renderComponent(
                itemModalFactory(item, positiveAction, negativeAction)
            );

            expect(screen.queryByText("Top")).not.toBeNull();
            expect(screen.queryByText("Current Position")).not.toBeNull();
            expect(screen.queryByText("Bottom")).not.toBeNull();

            expect(screen.queryByText("Other")).not.toBeNull();
        });
    });
});

function itemModalFactory(
    item: Item | undefined,
    positiveAction: (
        oldPos: number,
        newPos: Position,
        listId: string,
        item: Item
    ) => void,
    negativeAction: () => void
): JSX.Element {
    return (
        <ItemModal
            item={item}
            index={0}
            isVisible={true}
            title="Add a New Item"
            positiveActionText="Add"
            positiveAction={positiveAction}
            negativeActionText="Cancel"
            negativeAction={negativeAction}
            listType={"Shopping"}
        />
    );
}

/**
 * Mock function calls that retrieve data from APIs used by the app. In this case, the data being mock is
 * list data stored locally in app storage.
 *
 * @param listData shopping/todo/etc. lists
 */
function mockAppData(listData: List[]): void {
    let lists: Promise<List[]> = new Promise<List[]>((resolve) => {
        resolve(listData);
    });

    let numLists: Promise<number> = new Promise<number>((resolve) => {
        resolve(listData.length);
    });

    jest.spyOn(utils, "getLists").mockReturnValue(lists);
    jest.spyOn(utils, "getNumLists").mockReturnValue(numLists);
}
