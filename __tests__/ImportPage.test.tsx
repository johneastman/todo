import { NavigationContainer } from "@react-navigation/native";
import ImportPage from "../components/ImportPage";
import { assertListsEqual, renderComponent } from "./testUtils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackNavigatorParamList } from "../types";
import { screen, fireEvent, act } from "@testing-library/react-native";
import { encode } from "base-64";
import { AppContext, defaultSettings } from "../contexts/app.context";
import { AppAction, UpdateLists } from "../data/reducers/app.reducer";
import { Item, List } from "../data/data";

describe("<ImportPage />", () => {
    const rawJSON: string = `
        [
            {
                "name": "my list",
                "listType": "Shopping",
                "defaultNewItemPosition": "bottom",
                "isSelected": false,
                "items": [
                    {
                        "name": "celery",
                        "quantity": 2,
                        "isComplete": false,
                        "isSelected": false
                    },
                    {
                        "name": "hummus",
                        "quantity": 1,
                        "isComplete": false,
                        "isSelected": false
                    }
                ]
            }
        ]`;

    const dispatch = jest.fn();

    describe("error conditions", () => {
        it("does not provide data to import", async () => {
            renderComponent(componentFactory(dispatch));

            // Press "import" button
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(screen.queryByText("No data provided")).not.toBeNull();
            expect(dispatch).toBeCalledTimes(0);
        });

        it("is invalid base-64 encoding", async () => {
            renderComponent(componentFactory(dispatch));

            // Enter raw JSON data to import
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter data to import"),
                    "bad json"
                )
            );

            // Press "import" button
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(
                screen.queryByText("Unable to parse provided data")
            ).not.toBeNull();
            expect(dispatch).toBeCalledTimes(0);
        });

        it("is invalid JSON", async () => {
            renderComponent(componentFactory(dispatch));

            // Enter raw JSON data to import
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter data to import"),
                    encode("bad json")
                )
            );

            // Press "import" button
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(
                screen.queryByText("Unable to parse provided data")
            ).not.toBeNull();
            expect(dispatch).toBeCalledTimes(0);
        });
    });

    describe("clear data", () => {
        it("clears data", async () => {
            renderComponent(componentFactory(dispatch));

            // Enter raw JSON data to import
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter data to import"),
                    rawJSON
                )
            );

            // Clear input text
            await act(() => fireEvent.press(screen.getByText("Clear")));

            // Confirm the data has been cleared by trying to import it.
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(screen.queryByText("No data provided")).not.toBeNull();
        });
    });

    it("successfully loads data", async () => {
        const dispatch = (action: AppAction) => {
            expect(action.type).toEqual("LISTS_UPDATE_ALL");

            const expectedLists: List[] = [
                new List("my list", "Shopping", "bottom", [
                    new Item("celery", 2, false),
                    new Item("hummus", 1, false),
                ]),
            ];

            const updateAction = action as UpdateLists;
            assertListsEqual(updateAction.lists, expectedLists);
        };

        renderComponent(componentFactory(dispatch));

        // Enter raw JSON data to import
        await act(() =>
            fireEvent.changeText(
                screen.getByPlaceholderText("Enter data to import"),
                encode(rawJSON)
            )
        );

        // Press "import" button
        fireEvent.press(screen.getByText("Import"));
    });
});

function componentFactory(dispatch: (action: AppAction) => void): JSX.Element {
    const appData = {
        settings: defaultSettings,
        lists: [],
        listsState: {
            currentIndex: -1,
            isModalVisible: false,
            isDeleteAllModalVisible: false,
        },
        itemsState: {
            currentIndex: -1,
            isModalVisible: false,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
    };

    const appContext = {
        data: appData,
        dispatch: dispatch,
    };

    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <AppContext.Provider value={appContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Import"
                        component={ImportPage}
                    ></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </AppContext.Provider>
    );
}
