import { fireEvent, render, screen, act } from "@testing-library/react-native";
import {
    AppStackNavigatorParamList,
    CellAction,
    CellSelect,
    ListsContextData,
} from "../../types";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActionsPage from "../../components/pages/ActionsPage";
import {
    DeleteItems,
    ItemsIsComplete,
    ListsAction,
    ListsData,
} from "../../data/reducers/lists.reducer";
import { defaultListsData, ListsContext } from "../../contexts/lists.context";

describe("<ActionsModal />", () => {
    describe("Errors", () => {
        it("displays an error when no cells are selected", async () => {
            actionsPageFactory();

            await act(() => fireEvent.press(screen.getByText("Run")));

            expect(
                screen.getByText("Select the cells on which to perform actions")
            ).not.toBeNull();
        });

        it("displays an error when no actions are selected", async () => {
            actionsPageFactory();

            await act(() => fireEvent.press(screen.getByText("All")));

            // Select "Run" without setting the required action.
            await act(() => fireEvent.press(screen.getByText("Run")));

            expect(
                screen.getByText(
                    "Select an action to perform on the selected cells"
                )
            ).not.toBeNull();
        });
    });

    describe("cell actions", () => {
        it("adds an action", async () => {
            actionsPageFactory();

            await act(() => fireEvent.press(screen.getByText("All")));

            await act(() => fireEvent.press(screen.getByText("Add")));

            expect(screen.getByTestId("delete-action-1")).not.toBeNull();
        });

        it("deletes an action", async () => {
            actionsPageFactory((action: ListsAction) => {
                console.log(action.type);
            });

            await act(() => fireEvent.press(screen.getByText("All")));

            // Set the first/required action
            const testId: string = `action-dropdown-0-Complete`;
            await act(() => fireEvent.press(screen.getByTestId(testId)));

            // Add another action
            await addAction(1, "Delete");

            // Delete an action
            await act(() =>
                fireEvent.press(screen.getByTestId("delete-action-1"))
            );

            // Run the actions
            await act(() => fireEvent.press(screen.getByText("Run")));
        });

        it("disable 'add' button when last action is a terminating actions", async () => {
            actionsPageFactory();

            // Add an action
            await addAction(1, "Delete");

            // Add another action after delete.
            await act(() => fireEvent.press(screen.getByText("Add")));

            // Another action should not have been added
            expect(screen.queryByTestId("action-dropdown-2")).toBeNull();
        });
    });
});

async function addAction(index: number, action: CellAction) {
    // Press "add action" button
    await act(() => fireEvent.press(screen.getByText("Add")));

    // Select the new action
    const testId: string = `action-dropdown-${index}-${action}`;
    await act(() => fireEvent.press(screen.getByTestId(testId)));
}

function actionsPageFactory(dispatch?: (action: ListsAction) => void) {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const listsData: ListsData = {
        ...defaultListsData,
    };

    const listIndex: number = 0;

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: dispatch ?? jest.fn(),
    };

    const selectActions: [CellSelect, number[]][] = [
        ["All", [0, 1, 2, 3, 4, 5]],
        ["None", []],
    ];

    const cellActions: [CellAction, ListsAction][] = [
        ["Delete", new DeleteItems(listIndex)],
        ["Complete", new ItemsIsComplete(listIndex, true)],
        ["Incomplete", new ItemsIsComplete(listIndex, false)],
    ];

    render(
        <ListsContext.Provider value={listsContextData}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Actions"
                        component={ActionsPage}
                        initialParams={{
                            cellType: "Item",
                            selectActions: selectActions,
                            cellActions: cellActions,
                            cells: [
                                { value: 0, label: "Item 1" },
                                { value: 1, label: "Item 2" },
                                { value: 2, label: "Item 3" },
                                { value: 3, label: "Item 4" },
                                { value: 4, label: "Item 5" },
                                { value: 5, label: "Item 6" },
                            ],
                            listIndex: listIndex,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </ListsContext.Provider>
    );
}
