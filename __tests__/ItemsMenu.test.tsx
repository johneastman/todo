import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import ItemsMenu from "../components/ItemsMenu";

describe("<ItemsMenu />", () => {
    const mockFn = jest.fn();

    beforeEach(() => {
        render(
            <ItemsMenu
                listName={"Name"}
                quantity={0}
                displayAddItemModal={mockFn}
            />
        );
    });

    it("calls add item", () => {
        fireEvent.press(screen.getByText("Add Item"));

        expect(mockFn).toBeCalledTimes(1);
    });

    it("displays number of items", () => {
        expect(screen.getByText("0 Items")).not.toBeNull();
    });
});
