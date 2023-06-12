import { render, screen, fireEvent } from "@testing-library/react-native";

import Quantity from "../components/Quantity";
import { useState } from "react";
import { getTextElementValue, getTextInputElementValue } from "./testUtils";
import { ReactTestInstance } from "react-test-renderer";

describe("<Quantity />", () => {
    it("sets quantity value", () => {
        let quantity: number = 1;
        let setQuantity = jest.fn();

        render(<Quantity value={quantity} setValue={setQuantity} />);

        let quantityValue: string | ReactTestInstance = getTextElementValue(
            screen.getByTestId("ItemModal-quantity")
        );
        expect(quantityValue).toEqual("1");
    });

    it("sets new quantity when incrementing", () => {
        let quantity: number = 1;
        let setQuantity = jest.fn();

        render(<Quantity value={quantity} setValue={setQuantity} />);

        fireEvent.press(screen.getByText("+"));

        expect(setQuantity).toHaveBeenCalledTimes(1);
    });

    it("sets new quantity when decrementing", () => {
        let quantity: number = 2;
        let setQuantity = jest.fn();

        render(<Quantity value={quantity} setValue={setQuantity} />);

        fireEvent.press(screen.getByText("-"));

        expect(setQuantity).toHaveBeenCalledTimes(1);
    });
});
