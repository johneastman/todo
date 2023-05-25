import { ReactTestInstance } from "react-test-renderer";

export function getTextInputElementValue(element: ReactTestInstance): string {
    return element.props.defaultValue;
}
