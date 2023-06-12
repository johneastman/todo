import { ReactTestInstance } from "react-test-renderer";

export function getTextInputElementValue(element: ReactTestInstance): string {
    return element.props.defaultValue;
}

export function getTextElementValue(element: ReactTestInstance): string | ReactTestInstance {
    return element.children[0];
}
