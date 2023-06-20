import { ReactTestInstance } from "react-test-renderer";
import { Item } from "../data/data";

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