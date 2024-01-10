import { act, render } from "@testing-library/react-native";
import ItemsPage from "../components/ItemsPage";
import { AppStackNavigatorParamList } from "../types";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Item, List } from "../data/data";

const mockGetLists = jest.fn();
const mockGetItems = jest.fn();
const mockGetNumLists = jest.fn();
const mockSaveItems = jest.fn();
const mockSaveList = jest.fn();

jest.mock("../data/utils", () => {
    return {
        getItems: jest.fn((listId: string): Item[] => mockGetItems(listId)),
        getLists: jest.fn((): List[] => mockGetLists()),
        getNumLists: jest.fn(() => mockGetNumLists()),
        saveList: jest.fn((list: List) => mockSaveList(list)),
        saveItems: jest.fn(
            (listId: string, sectionIndex: number, items: Item[]) =>
                mockSaveItems(listId, sectionIndex, items)
        ),
    };
});

// Source for mocking react-native-reanimated: https://reactnavigation.org/docs/testing/
jest.mock("react-native-reanimated", () => {
    const Reanimated = require("react-native-reanimated/mock");

    // The mock for `call` immediately calls the which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

describe("<ItemsPage />", () => {
    const first: List = new List("0", "First", "Shopping", "bottom", []);
    const second: List = new List("1", "Second", "Ordered To-Do", "top", []);

    mockGetLists.mockImplementation((): List[] => [first, second]);

    it("renders component", async () => {
        render(itemsPageFactory(first));
    });
});

function itemsPageFactory(list: List): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Items"
                    component={ItemsPage}
                    initialParams={{ list: list }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
