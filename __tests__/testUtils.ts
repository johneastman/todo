import { ReactTestInstance } from "react-test-renderer";
import { Item } from "../data/data";
import { render, waitFor } from "@testing-library/react-native";

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