import { ReactTestInstance } from "react-test-renderer";
import { BOTTOM, Item, List } from "../data/data";
import {
    render,
    waitFor,
    act,
    fireEvent,
    screen,
} from "@testing-library/react-native";
import { Position, SelectionValue } from "../types";
import { AddUpdateListState } from "../data/reducers/addUpdateList.reducer";
import { AddUpdateItemState } from "../data/reducers/addUpdateItem.reducer";
import { MoveItemsModalState } from "../data/reducers/moveItemsModal.reducer";
import { CloudManagerState } from "../data/reducers/cloudManager.reducer";
import { ListsState } from "../data/reducers/listsState.reducer";
import { ActionsState } from "../data/reducers/actions.reducer";
import { ItemsState } from "../data/reducers/itemsState.reducer";
import { SettingsState } from "../data/reducers/settingsState.reducer";

export function findByText(text: string): ReactTestInstance {
    const element: ReactTestInstance | null = screen.queryByText(text);
    if (element === null) {
        throw Error(`Unable to find an element with text: ${text}`);
    }
    return element;
}

/**
 * Render components for testing. Component rendering is wrapped in "waitFor" to handle
 * any potential state changes while the component is being rendered.
 *
 * @param component component to render during testing
 */
export async function renderComponent(component: JSX.Element): Promise<void> {
    await waitFor(() => {
        render(component);
    });
}

export function getTextInputElementValue(element: ReactTestInstance): string {
    return element.props.defaultValue;
}

export function getTextElementValue(
    element: ReactTestInstance | null
): string | ReactTestInstance {
    return element?.children[0] ?? "";
}

export function expectAllItemsToEqualIsComplete(
    items: Item[],
    isComplete: boolean
): void {
    for (const item of items) {
        expect(item.isComplete).toEqual(isComplete);
    }
}

export async function populateAddUpdateListPage(options: {
    name?: string;
    position?: SelectionValue<Position>;
    type?: string;
    newItemDefaultPos?: SelectionValue<Position>;
}): Promise<void> {
    // Give the list a name
    await act(() =>
        fireEvent.changeText(
            screen.getByPlaceholderText("Enter the name of your list"),
            options.name ?? ""
        )
    );

    // Select List Type
    await act(() =>
        fireEvent.press(screen.getByText(options.type ?? "Shopping List"))
    );

    // Select where new items are added by default
    const newItemDefaultPos = options.newItemDefaultPos ?? BOTTOM;
    await act(() =>
        fireEvent.press(
            screen.getByTestId(
                `Select new items default position-${newItemDefaultPos.label}`
            )
        )
    );

    // Select where in the list the new item is added
    const newListPos = options.position ?? BOTTOM;
    await act(() => {
        // Check for "Add to" and "Move to" and use which ever element is not null
        const testIds: string[] = [
            `list-modal-position-${newListPos.label}`,
            `list-modal-position-${newListPos.label}`,
        ];

        let wasElementFound: boolean = false;
        for (const testId of testIds) {
            const element = screen.queryByTestId(testId);
            if (element !== null) {
                fireEvent.press(element);
                wasElementFound = true;
                break;
            }
        }

        // Fail the test if none of the provided test ids were found.
        if (!wasElementFound) {
            throw Error(
                `populateAddUpdateListPage: Position for new list not supported. Position display name: ${newListPos.label}`
            );
        }
    });
}

export async function setText(
    element: ReactTestInstance,
    text: string
): Promise<void> {
    await act(() => fireEvent.changeText(element, text));
}

export async function pressSwitch(
    element: ReactTestInstance,
    isSelected: boolean
): Promise<void> {
    await act(() => fireEvent(element, "valueChange", isSelected));
}

/* * * * * * * * * *
 * Item Factories  *
 * * * * * * * * * */
export function itemComplete(
    name: string,
    notes: string,
    quantity: number
): Item {
    return new Item(name, notes, quantity, { isComplete: true });
}

export function itemIncomplete(
    name: string,
    notes: string,
    quantity: number
): Item {
    return new Item(name, notes, quantity, { isComplete: false });
}

/* * * * * * * * * * *
 * Assertion helpers *
 * * * * * * * * * * */
export function assertListsEqual(actual: List[], expected: List[]): void {
    expect(actual.length).toEqual(expected.length);

    for (let i = 0; i < actual.length; i++) {
        assertListEqual(actual[i], expected[i]);
    }
}

export function assertListEqual(actual: List, expected: List): void {
    expect(actual.name).toEqual(expected.name);
    expect(actual.type).toEqual(expected.type);
    expect(actual.isSelected).toEqual(expected.isSelected);
    expect(actual.listType).toEqual(expected.listType);
    expect(actual.defaultNewItemPosition).toEqual(
        expected.defaultNewItemPosition
    );
    expect(actual.isLocked).toEqual(expected.isLocked);
    assertItemsEqual(actual.items, expected.items);
}

export function assertItemsEqual(actual: Item[], expected: Item[]): void {
    expect(actual.length).toEqual(expected.length);

    for (let i = 0; i < actual.length; i++) {
        assertItemEqual(actual[i], expected[i]);
    }
}

export function assertItemEqual(actual: Item, expected: Item): void {
    expect(actual.name).toEqual(expected.name);
    expect(actual.notes).toEqual(expected.notes);
    expect(actual.type).toEqual(expected.type);
    expect(actual.isSelected).toEqual(expected.isSelected);
    expect(actual.quantity).toEqual(expected.quantity);
    expect(actual.isComplete).toEqual(expected.isComplete);
    expect(actual.isLocked).toEqual(expected.isLocked);
}

export function assertAddUpdateListStateEqual(
    actual: AddUpdateListState,
    expected: AddUpdateListState
) {
    expect(actual.name).toEqual(expected.name);
    expect(actual.defaultNewItemPosition).toEqual(
        expected.defaultNewItemPosition
    );
    expect(actual.listType).toEqual(expected.listType);
    expect(actual.position).toEqual(expected.position);
    expect(actual.error).toEqual(expected.error);
    expect(actual.currentIndex).toEqual(expected.currentIndex);
}

export function assertAddUpdateItemStateEqual(
    actual: AddUpdateItemState,
    expected: AddUpdateItemState
) {
    expect(actual.name).toEqual(expected.name);
    expect(actual.quantity).toEqual(expected.quantity);
    expect(actual.position).toEqual(expected.position);
    expect(actual.error).toEqual(expected.error);
}

export function assertMoveItemsModalStateEqual(
    actual: MoveItemsModalState,
    expected: MoveItemsModalState
) {
    expect(actual.action).toEqual(expected.action);
    expect(actual.destinationListIndex).toEqual(expected.destinationListIndex);
    expect(actual.error).toEqual(expected.error);
}

export function assertCloudManagerStateEqual(
    actualState: CloudManagerState,
    expectedState: CloudManagerState
) {
    expect(actualState.currentUser).toEqual(expectedState.currentUser);
    expect(actualState.allUsers).toEqual(expectedState.allUsers);
    expect(actualState.isLoading).toEqual(expectedState.isLoading);
    expect(actualState.message).toEqual(expectedState.message);
}

export function assertListsStateEqual(
    actualState: ListsState,
    expectedState: ListsState
) {
    expect(actualState.isDeleteAllModalVisible).toEqual(
        expectedState.isDeleteAllModalVisible
    );
    expect(actualState.currentIndex).toEqual(expectedState.currentIndex);
}

export function assertActionsStateEqual(
    actualState: ActionsState,
    expectedState: ActionsState
) {
    expect(actualState.cellsToSelect).toEqual(expectedState.cellsToSelect);
    expect(actualState.actions).toEqual(expectedState.actions);
    expect(actualState.error).toEqual(expectedState.error);
}

export function assertItemsStateEqual(
    actualState: ItemsState,
    expectedState: ItemsState
) {
    expect(actualState.isCopyModalVisible).toEqual(
        expectedState.isCopyModalVisible
    );
    expect(actualState.isDeleteAllModalVisible).toEqual(
        expectedState.isDeleteAllModalVisible
    );
    expect(actualState.currentIndex).toEqual(expectedState.currentIndex);
}

export function assertSettingsStateEqual(
    actualState: SettingsState,
    expectedState: SettingsState
) {
    expect(actualState.isDeleteModalVisible).toEqual(
        expectedState.isDeleteModalVisible
    );
}
