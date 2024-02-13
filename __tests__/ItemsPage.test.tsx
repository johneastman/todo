import { fireEvent, render, screen, act } from "@testing-library/react-native";
import {
    AppContext,
    defaultAppData,
    defaultSettings,
} from "../contexts/app.context";
import { NavigationContainer } from "@react-navigation/native";
import { AppDataContext, AppStackNavigatorParamList } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemsPage from "../components/ItemsPage";
import { AppAction, AppData, appReducer } from "../data/reducers/app.reducer";
import { Item, List } from "../data/data";

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
    describe("Move Items Menu Option", () => {
        const currentListIndex: number = 0;

        /**
         * There is no need for a test with no lists because the button for moving items is not accessible
         * under that condition.
         */
        describe("is disabled", () => {
            it("when there is only 1 list with no items", async () => {
                const lists: List[] = [new List("A", "Shopping", "bottom")];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(true);
            });

            it("when there is 1 list with unselected items", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom", [
                        new Item("1", 1, false),
                        new Item("2", 2, false),
                    ]),
                ];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(true);
            });

            it("when there is 1 list with selected items", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom", [
                        new Item("1", 1, false, true),
                        new Item("2", 2, false),
                    ]),
                ];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(true);
            });

            it("when there are multiple lists all with no items", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom"),
                    new List("B", "Shopping", "bottom"),
                ];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(true);
            });

            // Items can only be moved/copied from the current list when selected.
            it("when the current list contains unselected items but there are no items in the other", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom", [
                        new Item("A", 1, false),
                    ]),
                    new List("B", "Shopping", "bottom"),
                ];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(true);
            });
        });

        describe("is enabled", () => {
            it("when there is more than 1 list, the current list contains items, and at least one other list contain items", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom", [
                        new Item("A", 1, false),
                    ]),
                    new List("B", "Shopping", "bottom", [
                        new Item("B", 1, false),
                    ]),
                ];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(false);
            });

            it("when there is more than 1 list and the current list contains no items but at least one other list contain items", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom"),
                    new List("B", "Shopping", "bottom", [
                        new Item("1", 1, false),
                    ]),
                ];
                itemsPageFactory(currentListIndex, lists);

                await assertButtonDisabled(false);
            });

            it("when there is more than 1 list and the current list contains selected items but all other lists contain no items", async () => {
                const lists: List[] = [
                    new List("A", "Shopping", "bottom", [
                        new Item("A", 1, false, true),
                    ]),
                    new List("B", "Shopping", "bottom"),
                    new List("C", "List", "top"),
                ];
                itemsPageFactory(currentListIndex, lists);

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

    const appData: AppData = {
        settings: defaultSettings,
        lists: lists,
        listsState: {
            isModalVisible: false,
            isDeleteAllModalVisible: false,
            currentIndex: -1,
        },
        itemsState: {
            isModalVisible: false,
            currentIndex: -1,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
    };

    const appContext: AppDataContext = {
        data: appData,
        dispatch: (action: AppAction) => appReducer(defaultAppData, action),
    };

    const { getByTestId } = render(
        <AppContext.Provider value={appContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Items"
                        component={ItemsPage}
                        initialParams={{ listIndex: currentListIndex }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AppContext.Provider>
    );

    return getByTestId;
}
