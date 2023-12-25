import { NavigationContainer } from "@react-navigation/native";
import ImportPage from "../components/ImportPage";
import { TIMEOUT_MS, renderComponent } from "./testUtils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackNavigatorParamList } from "../types";
import { screen, fireEvent, act } from "@testing-library/react-native";
import { ItemJSON, ListJSON } from "../data/utils";

const mockSaveListsData = jest.fn();
const mockSaveItemsData = jest.fn();

jest.mock("../data/utils", () => {
    return {
        saveListsData: jest.fn((listsJSON: ListJSON[]) =>
            mockSaveListsData(listsJSON)
        ),
        saveItemsData: jest.fn((listId: string, itemsJSON: ItemJSON[]) =>
            mockSaveItemsData(listId, itemsJSON)
        ),
    };
});

describe("<ImportPage />", () => {
    const listId: string = "edd70bc5-774a-443d-9de4-2b42b0bb377e";
    const rawJSON: string = `{
    "lists": [
        {
            "id": ${listId},
            "name": "my list",
            "type": "Shopping",
            "defaultNewItemPosition": "bottom",
            "isSelected": false
        }
        ],
        "items": [
            {
                "listId": ${listId},
                "items": [
                    {
                        "value": "celery",
                        "quantity": 2,
                        "isComplete": false,
                        "isSelected": false,
                        "itemType": "Item"
                    },
                    {
                        "value": "hummus",
                        "quantity": 1,
                        "isComplete": false,
                        "isSelected": false,
                        "itemType": "Item"
                    }
                ]
            }
        ]
    }`;

    beforeEach(() => {
        mockSaveListsData.mockReset();
        mockSaveItemsData.mockReset();
    });

    describe("error conditions", () => {
        it("does not provide data to import", async () => {
            renderComponent(componentFactory());

            // Press "import" button
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(screen.queryByText("No data provided")).not.toBeNull();
        });

        it("is unable to parse provided data", async () => {
            renderComponent(componentFactory());

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
        });
    });

    describe("clear data", () => {
        it("clears data", async () => {
            renderComponent(componentFactory());

            // Enter raw JSON data to import
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter data to import"),
                    rawJSON
                )
            );

            // Clear input text
            await act(() => fireEvent.press(screen.getByText("Clear")));

            // Press "import" button
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(screen.queryByText("No data provided")).not.toBeNull();
        });
    });

    it(
        "successfully loads data",
        async () => {
            mockSaveListsData.mockImplementation((listsJSON: ListJSON[]) => {
                const expectedLists: ListJSON[] = [
                    {
                        id: listId,
                        name: "my list",
                        type: "Shopping",
                        defaultNewItemPosition: "bottom",
                        isSelected: false,
                    },
                ];
                expect(listsJSON).toEqual(expectedLists);
            });

            mockSaveItemsData.mockImplementation(
                (actualListId: string, actualItemsJSON: ItemJSON[]) => {
                    const expectedItemsJSON: ItemJSON[] = [
                        {
                            value: "celery",
                            quantity: 2,
                            isComplete: false,
                            isSelected: false,
                            itemType: "Item",
                        },
                        {
                            value: "hummus",
                            quantity: 1,
                            isComplete: false,
                            isSelected: false,
                            itemType: "Item",
                        },
                    ];
                    expect(actualListId).toEqual(listId);
                    expect(actualItemsJSON).toEqual(expectedItemsJSON);
                }
            );

            renderComponent(componentFactory());

            // Enter raw JSON data to import
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter data to import"),
                    rawJSON
                )
            );

            // Press "import" button
            fireEvent.press(screen.getByText("Import"));
        },
        TIMEOUT_MS
    );
});

function componentFactory(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Import"
                    component={ImportPage}
                ></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
