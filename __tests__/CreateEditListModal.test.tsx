import { render, screen, fireEvent } from "@testing-library/react-native";
import ListModal from "../components/CreateEditListModal";
import { getTextInputElementValue } from "./testUtils";

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
        />
    );

    it("adds new list", () => {
        render(element);

        // Item name/text input
        let textInputValue = getTextInputElementValue(
            screen.getByTestId("ListModal-list-name")
        );
        expect(textInputValue).toEqual("");
    });

    it("adds list (presses add button)", () => {
        render(element);

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(1);
    });

    it("dismisses modal (presses cancel button)", () => {
        render(element);

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });
});
