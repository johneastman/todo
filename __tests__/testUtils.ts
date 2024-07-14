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
import { ListModalState } from "../data/reducers/listModal.reducer";
import { ItemModalState } from "../data/reducers/itemModal.reducer";
import { MoveItemsModalState } from "../data/reducers/moveItemsModal.reducer";
import { CollectionPageViewState } from "../data/reducers/collectionPageView.reducer";
import { DataManagerState } from "../data/reducers/dataManager.reducer";
import { Account } from "../data/reducers/account.reducer";
import { ListsState } from "../data/reducers/listsState.reducer";
import { ActionsState } from "../data/reducers/actions.reducer";
import { ItemsState } from "../data/reducers/itemsState.reducer";

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

export async function populateListModal(options: {
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
            `Add to-${newListPos.label}`,
            `Move to-${newListPos.label}`,
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
            fail(
                `populateListModal: Position for new list not supported. Position display name: ${newListPos.label}`
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

/**
 * Assertion helpers
 */
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
    expect(actual.ignoreSelectAll).toEqual(expected.ignoreSelectAll);
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
    expect(actual.type).toEqual(expected.type);
    expect(actual.isSelected).toEqual(expected.isSelected);
    expect(actual.quantity).toEqual(expected.quantity);
    expect(actual.isComplete).toEqual(expected.isComplete);
    expect(actual.ignoreSelectAll).toEqual(expected.ignoreSelectAll);
}

export function assertListModalStateEqual(
    actual: ListModalState,
    expected: ListModalState
) {
    expect(actual.name).toEqual(expected.name);
    expect(actual.defaultNewItemPosition).toEqual(
        expected.defaultNewItemPosition
    );
    expect(actual.listType).toEqual(expected.listType);
    expect(actual.position).toEqual(expected.position);
    expect(actual.error).toEqual(expected.error);
}

export function assertItemModalStateEqual(
    actual: ItemModalState,
    expected: ItemModalState
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
    expect(actual.source).toEqual(expected.source);
    expect(actual.destination).toEqual(expected.destination);
    expect(actual.error).toEqual(expected.error);
}

export function assertCollectionPageViewStateEqual(
    actual: CollectionPageViewState,
    expected: CollectionPageViewState
) {
    expect(actual.isDrawerVisible).toEqual(expected.isDrawerVisible);
}

export function assertDataManagerStateEqual(
    actualState: DataManagerState,
    expectedState: DataManagerState
) {
    expect(actualState.isLoading).toEqual(expectedState.isLoading);
    expect(actualState.message).toEqual(expectedState.message);
}

export function assertAccountStateEqual(
    actualState: Account,
    expectedState: Account
) {
    expect(actualState.username).toEqual(expectedState.username);
    expect(actualState.isAccountCreationModalVisible).toEqual(
        expectedState.isAccountCreationModalVisible
    );
    expect(actualState.error).toEqual(expectedState.error);
}

export function assertListsStateEqual(
    actualState: ListsState,
    expectedState: ListsState
) {
    expect(actualState.isModalVisible).toEqual(expectedState.isModalVisible);
    expect(actualState.isActionsModalVisible).toEqual(
        expectedState.isActionsModalVisible
    );
    expect(actualState.isDeleteAllModalVisible).toEqual(
        expectedState.isDeleteAllModalVisible
    );
    expect(actualState.currentIndex).toEqual(expectedState.currentIndex);
    expect(actualState.visibleFrom).toEqual(expectedState.visibleFrom);
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
    expect(actualState.isModalVisible).toEqual(expectedState.isModalVisible);
    expect(actualState.isActionsModalVisible).toEqual(
        expectedState.isActionsModalVisible
    );
    expect(actualState.isCopyModalVisible).toEqual(
        expectedState.isCopyModalVisible
    );
    expect(actualState.isDeleteAllModalVisible).toEqual(
        expectedState.isDeleteAllModalVisible
    );
    expect(actualState.currentIndex).toEqual(expectedState.currentIndex);
}
