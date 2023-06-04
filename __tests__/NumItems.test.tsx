import { render, screen, waitFor } from "@testing-library/react-native";
import NumItems from "../components/NumItems";
import { List } from "../data/List";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<NumItems />", () => {
    // NOTE: Render has to happen AFTER data is saved into AsyncStorage
    const list = new List("0", "List");

    afterEach(() => {
        AsyncStorage.clear();
    });

    it("displays 0 items", async () => {
        await waitFor(() => {
            render(<NumItems list={list} styles={{}} />);
        });

        expect(screen.getByText("0 Items")).not.toBeNull();
    });

    it("displays 1 item", async () => {
        AsyncStorage.setItem(
            "0",
            '[{"value": "My Item", "quantity": 1, "isComplete": false}]'
        );

        await waitFor(() => {
            render(<NumItems list={list} styles={{}} />);
        });

        expect(screen.getByText("1 Item")).not.toBeNull();
    });

    it("displays 2 items", async () => {
        AsyncStorage.setItem(
            "0",
            '[{"value": "My Item", "quantity": 1, "isComplete": false}, {"value": "My Second Item", "quantity": 2, "isComplete": true}]'
        );

        await waitFor(() => {
            render(<NumItems list={list} styles={{}} />);
        });

        expect(screen.getByText("2 Items")).not.toBeNull();
    });
});
