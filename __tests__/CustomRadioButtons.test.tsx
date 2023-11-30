import { render, screen, fireEvent } from "@testing-library/react-native";
import CustomRadioButtons from "../components/CustomRadioButtons";
import { SelectionValue } from "../types";

describe("<CustomRadioButtons />", () => {
    it("selects option", () => {
        const setSelectedValue = jest.fn();

        const data: SelectionValue<number>[] = [
            { label: "One", value: 1 },
            { label: "Two", value: 2 },
            { label: "Three", value: 3 },
        ];

        render(
            <CustomRadioButtons
                data={data}
                selectedValue={undefined}
                setSelectedValue={setSelectedValue}
            />
        );

        // Select radio button option
        fireEvent.press(screen.getByTestId("no-title-One-testID"));

        expect(setSelectedValue).toBeCalledTimes(1);
    });
});
