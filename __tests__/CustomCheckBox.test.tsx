import { render, screen, fireEvent } from "@testing-library/react-native";
import CustomCheckBox from "../components/CustomCheckBox";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<CustomCheckBox />", () => {
    it("checks checkbox", () => {
        const isChecked = jest.fn();
        const testId: string = "checkbox-test-id";

        render(
            <CustomCheckBox
                isChecked={false}
                onChecked={isChecked}
                testID={testId}
            />
        );

        fireEvent.press(screen.getByTestId(testId));

        expect(isChecked).toBeCalledTimes(1);
    });
});
