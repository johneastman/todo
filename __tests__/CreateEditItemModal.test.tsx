import { render, screen, fireEvent } from "@testing-library/react-native";

import ItemModal from "../components/CreateEditItemModal";
import { ReactTestInstance } from "react-test-renderer";
import { Item } from "../data/Item";

describe("<ItemModal />", () => {
    let positiveAction = jest.fn();
    let negativeAction = jest.fn();

    it("adds new item", () => {
        render(
            <ItemModal
                item={undefined}
                listId={0}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        );

        // Item name/text input
        let textInputValue = getTextInputElementValue(
            screen.getByTestId("ItemModal-item-name")
        );
        expect(textInputValue).toEqual("");

        // Quantity
        let quantityElement = screen.getByTestId("ItemModal-quantity");
        let quantityValue = quantityElement.children[0];
        expect(quantityValue).toEqual("1");
    });

    it("updates item", () => {
        render(
            <ItemModal
                item={new Item(0, "My item name", 5)}
                listId={0}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        );

        // Item name/text input
        let textInputValue = getTextInputElementValue(
            screen.getByTestId("ItemModal-item-name")
        );
        expect(textInputValue).toEqual("My item name");

        // Quantity
        let quantityElement = screen.getByTestId("ItemModal-quantity");
        let quantityValue = quantityElement.children[0];
        expect(quantityValue).toEqual("5");
    });

    it("increments quantity", () => {
        render(
            <ItemModal
                item={undefined}
                listId={0}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        );

        let quantityElement = screen.getByTestId("ItemModal-quantity");
        let quantityValue = quantityElement.children[0];

        expect(quantityValue).toEqual("1");

        fireEvent.press(screen.getByText("+"));

        quantityValue = quantityElement.children[0];
        expect(quantityValue).toEqual("2");
    });

    it("decrements quantity", () => {
        render(
            <ItemModal
                item={new Item(0, "name", 3)}
                listId={0}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        );

        let quantityElement = screen.getByTestId("ItemModal-quantity");
        let quantityValue = quantityElement.children[0];

        expect(quantityValue).toEqual("3");

        fireEvent.press(screen.getByText("-"));

        quantityValue = quantityElement.children[0];
        expect(quantityValue).toEqual("2");

        fireEvent.press(screen.getByText("-"));

        // Test that pressing the decrement buttons, when the quantity is 1, does not decrement the quantiy anymore.
        quantityValue = quantityElement.children[0];
        expect(quantityValue).toEqual("1");

        fireEvent.press(screen.getByText("-"));

        quantityValue = quantityElement.children[0];
        expect(quantityValue).toEqual("1");
    });

    it("dismisses modal", () => {
        render(
            <ItemModal
                item={undefined}
                listId={0}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        );

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });

    it("adds item", () => {
        render(
            <ItemModal
                item={undefined}
                listId={0}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        );

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(1);
    });
});

function getTextInputElementValue(element: ReactTestInstance): string {
    return element.props.defaultValue;
}
