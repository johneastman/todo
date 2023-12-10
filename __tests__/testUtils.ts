import { ReactTestInstance } from "react-test-renderer";
import { BOTTOM, Item } from "../data/data";
import { render, waitFor, act, fireEvent, screen } from "@testing-library/react-native";
import { Position, SelectionValue } from "../types";

export const TIMEOUT_MS = 20000;

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

export function getTextElementValue(element: ReactTestInstance): string | ReactTestInstance {
    return element.children[0];
}

export function expectAllItemsToEqualIsComplete(items: Item[], isComplete: boolean): void {
    for (let item of items) {
        expect(item.isComplete).toEqual(isComplete);
    }
}

export async function populateListModal(
    options: { name?: string, position?: SelectionValue<Position>; type?: string, newItemDefaultPos?: SelectionValue<Position> }
): Promise<void> {
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
                `Select new items default position-${newItemDefaultPos.label}-testID`
            )
        )
    );

    // Select where in the list the new item is added
    const newListPos = options.position ?? BOTTOM;
    await act(() => {
        // Check for "Add to" and "Move to" and use which ever element is not null
        const testIds: string[] = [
            `Add to-${newListPos.label}-testID`,
            `Move to-${newListPos.label}-testID`
        ]

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
            fail(`populateListModal: Position for new list not supported. Position display name: ${newListPos.label}`);
        }
    });
}

export async function setText(element: ReactTestInstance, text: string): Promise<void> {
    await act(() =>
        fireEvent.changeText(
            element,
            text
        )
    );
}
