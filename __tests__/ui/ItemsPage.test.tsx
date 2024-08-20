import { fireEvent, render, screen, act } from "@testing-library/react-native";
import { ListsContext, defaultListsData } from "../../contexts/lists.context";
import { NavigationContainer } from "@react-navigation/native";
import { ListsContextData, AppStackNavigatorParamList } from "../../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemsPage from "../../components/pages/ItemsPage";
import {
    ListsAction,
    ListsData,
    listsReducer,
} from "../../data/reducers/lists.reducer";
import { List } from "../../data/data";
import { itemIncomplete, listDefault } from "../testUtils";
import {
    ItemsState,
    ItemsStateAction,
    itemsStateReducer,
} from "../../data/reducers/itemsState.reducer";
import {
    defaultItemsStateData,
    ItemsStateContext,
    ItemsStateContextData,
} from "../../contexts/itemsState.context";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// // Source for mocking react-native-reanimated: https://reactnavigation.org/docs/testing/
jest.mock("react-native-reanimated", () => {
    const Reanimated = require("react-native-reanimated/mock");

    // The mock for `call` immediately calls the which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

describe("<ItemsPage />", () => {
    const currentListIndex: number = 0;

    describe("Move Items Menu Option", () => {
        const lists: List[] = [
            listDefault("Doesn't Contain Items", "Shopping", "bottom"),
            listDefault("Contains Items", "Shopping", "bottom", [
                itemIncomplete("B", "", 1),
            ]),
        ];

        describe("is disabled", () => {
            it("when the current list has no items", async () => {
                render(itemsPageFactory(currentListIndex, lists));
                await assertButtonDisabled(true);
            });
        });

        describe("is enabled", () => {
            it("when the current list has items", async () => {
                render(itemsPageFactory(1, lists));
                await assertButtonDisabled(false);
            });
        });
    });
});

async function assertButtonDisabled(isDisabled: boolean): Promise<void> {
    // Open Menu
    await act(() => fireEvent.press(screen.getByText("Item Options")));

    const element = screen.getByText("Move Items");
    expect(element.props).toHaveProperty("disabled", isDisabled);
}

function itemsPageFactory(currentListIndex: number, lists: List[]) {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const listsData: ListsData = {
        ...defaultListsData,
        lists: lists,
    };

    const listsContext: ListsContextData = {
        data: listsData,
        listsDispatch: (action: ListsAction) => listsReducer(listsData, action),
    };

    const itemsStateData: ItemsState = {
        ...defaultItemsStateData,
        isDrawerVisible: true,
    };

    const listsStateContext: ItemsStateContextData = {
        itemsState: itemsStateData,
        itemsStateDispatch: (action: ItemsStateAction) =>
            itemsStateReducer(itemsStateData, action),
    };

    return (
        <ListsContext.Provider value={listsContext}>
            <ItemsStateContext.Provider value={listsStateContext}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Items"
                            component={ItemsPage}
                            initialParams={{ listIndex: currentListIndex }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ItemsStateContext.Provider>
        </ListsContext.Provider>
    );
}
