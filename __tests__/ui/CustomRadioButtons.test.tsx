import { render, screen, fireEvent } from "@testing-library/react-native";
import CustomRadioButtons from "../../components/core/CustomRadioButtons";
import { SelectionValue } from "../../types";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

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
        fireEvent.press(screen.getByTestId("radio-button-One"));

        expect(setSelectedValue).toBeCalledTimes(1);
    });
});
