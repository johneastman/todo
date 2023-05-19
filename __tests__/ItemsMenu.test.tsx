import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import ItemsMenu from "../components/ItemsMenu";

describe("<ItemsMenu />", () => {
    it("is a test", () => {
        const mockFn = jest.fn();
        render(
            <ItemsMenu
                listName={"Name"}
                quantity={0}
                displayAddItemModal={mockFn}
            />
        );
        fireEvent.press(screen.getByText("Add Item"));

        expect(mockFn).toBeCalledTimes(1);
    });
});
