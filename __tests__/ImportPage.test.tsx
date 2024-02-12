import { NavigationContainer } from "@react-navigation/native";
import ImportPage from "../components/ImportPage";
import { renderComponent } from "./testUtils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackNavigatorParamList } from "../types";
import { screen, fireEvent, act } from "@testing-library/react-native";
import { ListJSON } from "../types";
import { encode } from "base-64";

const mockSaveListsData = jest.fn();

jest.mock("../data/utils", () => {
    return {
        saveListsData: jest.fn((listsJSON: ListJSON[]) =>
            mockSaveListsData(listsJSON)
        ),
    };
});

describe("<ImportPage />", () => {
    const rawJSON: string = `{
        "lists": [
            {
                "name": "my list",
                "type": "Shopping",
                "defaultNewItemPosition": "bottom",
                "isSelected": false,
                "items": [
                    {
                        "value": "celery",
                        "quantity": 2,
                        "isComplete": false,
                        "isSelected": false,
                    },
                    {
                        "value": "hummus",
                        "quantity": 1,
                        "isComplete": false,
                        "isSelected": false,
                    }
                ]
            }
        ]`;

    beforeEach(() => {
        mockSaveListsData.mockReset();
    });

    describe("error conditions", () => {
        it("does not provide data to import", async () => {
            renderComponent(componentFactory());

            // Press "import" button
            await act(() => fireEvent.press(screen.getByText("Import")));

            expect(screen.queryByText("No data provided")).not.toBeNull();
        });

        it("is invalid base-64 encoding", async () => {
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

        it("is invalid JSON", async () => {
            renderComponent(componentFactory());

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

    it("successfully loads data", async () => {
        mockSaveListsData.mockImplementation((listsJSON: ListJSON[]) => {
            const expectedLists: ListJSON[] = [
                {
                    name: "my list",
                    listType: "Shopping",
                    defaultNewItemPosition: "bottom",
                    isSelected: false,
                    items: [
                        {
                            name: "celery",
                            quantity: 2,
                            isComplete: false,
                            isSelected: false,
                        },
                        {
                            name: "hummus",
                            quantity: 1,
                            isComplete: false,
                            isSelected: false,
                        },
                    ],
                },
            ];
            expect(listsJSON).toEqual(expectedLists);
        });

        renderComponent(componentFactory());

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
