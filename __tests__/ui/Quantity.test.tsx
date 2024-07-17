import { render, screen, fireEvent } from "@testing-library/react-native";

import Quantity from "../../components/Quantity";
import { getTextElementValue } from "../testUtils";
import { ReactTestInstance } from "react-test-renderer";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<Quantity />", () => {
    it("sets quantity value", () => {
        const quantity: number = 1;
        const setQuantity = jest.fn();

        render(<Quantity value={quantity} setValue={setQuantity} />);

        const quantityValue: string | ReactTestInstance = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("1");
    });

    it("sets new quantity when incrementing", () => {
        const quantity: number = 1;
        const setQuantity = jest.fn();

        render(<Quantity value={quantity} setValue={setQuantity} />);

        fireEvent.press(screen.getByText("+"));

        expect(setQuantity).toHaveBeenCalledTimes(1);
    });

    it("sets new quantity when decrementing", () => {
        const quantity: number = 2;
        const setQuantity = jest.fn();

        render(<Quantity value={quantity} setValue={setQuantity} />);

        fireEvent.press(screen.getByText("-"));

        expect(setQuantity).toHaveBeenCalledTimes(1);
    });
});
