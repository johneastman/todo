import { render, screen, fireEvent } from "@testing-library/react-native";
import ListModal from "../components/ListModal";
import { getTextInputElementValue, renderComponent } from "./testUtils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<ListModal />", () => {
    let positiveAction = jest.fn();
    let negativeAction = jest.fn();
    let element: JSX.Element = (
        <ListModal
            list={undefined}
            isVisible={true}
            title="Add a New List"
            positiveActionText="Add"
            positiveAction={positiveAction}
            negativeActionText="Cancel"
            negativeAction={negativeAction}
            index={0}
        />
    );

    it("adds new list", () => {
        renderComponent(element);

        // Item name/text input
        let textInputValue = getTextInputElementValue(
            screen.getByTestId("ListModal-list-name")
        );
        expect(textInputValue).toEqual("");
    });

    it("adds list (presses add button)", () => {
        renderComponent(element);

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(1);
    });

    it("dismisses modal (presses cancel button)", () => {
        renderComponent(element);

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });
});
