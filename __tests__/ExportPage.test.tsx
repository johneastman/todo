import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { fireEvent, screen, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { encode } from "base-64";

import { AppContext, defaultSettings } from "../contexts/app.context";
import { AppStackNavigatorParamList, ListJSON, Settings } from "../types";
import ExportPage from "../components/ExportPage";
import { renderComponent } from "./testUtils";
import { List, Item } from "../data/data";
import { listsToJSON } from "../data/mappers";

const lists: List[] = [
    new List("A", "List", "bottom"),
    new List("B", "Ordered To-Do", "top", [new Item("1", 1, false)]),
    new List("C", "Shopping", "bottom"),
];

jest.mock("@react-native-clipboard/clipboard", () => ({
    setString: (value: string) => {
        const listsJSON: ListJSON[] = [
            {
                name: "A",
                listType: "List",
                defaultNewItemPosition: "bottom",
                isSelected: false,
                items: [],
            },
            {
                name: "B",
                listType: "Ordered To-Do",
                defaultNewItemPosition: "top",
                isSelected: false,
                items: [
                    {
                        name: "1",
                        quantity: 1,
                        isComplete: false,
                        isSelected: false,
                    },
                ],
            },
            {
                name: "C",
                listType: "Shopping",
                defaultNewItemPosition: "bottom",
                isSelected: false,
                items: [],
            },
        ];
        const expectedExportedJSONData: string = JSON.stringify(
            listsJSON,
            null,
            4
        );
        expect(value).toEqual(expectedExportedJSONData);
    },
}));

describe("<ExportPage />", () => {
    it("exports json data", async () => {
        await renderComponent(exportPageFactory(lists));

        await act(() =>
            fireEvent.press(screen.getByTestId("export-json-data"))
        );
    });
});

function exportPageFactory(lists: List[]): JSX.Element {
    const settings: Settings = {
        isDeveloperModeEnabled: true,
        defaultListType: "List",
        defaultListPosition: "bottom",
    };

    const appData = {
        settings: settings,
        lists: lists,
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
        dispatch: jest.fn(),
    };

    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <AppContext.Provider value={appContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Import"
                        component={ExportPage}
                    ></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </AppContext.Provider>
    );
}
