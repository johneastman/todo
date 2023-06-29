import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { List } from "./data/data";

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        list: List;
    };
    Settings: undefined;
};

export type ListPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Lists"
>;

export type ItemPageNavigationScreenProp = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Items"
>;

export type SettingsPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Settings"
>;

// Radio Buttons
export type Position = "top" | "current" | "bottom" | "other";

export type RadioButton = {
    displayValue: string;
    position: Position;
}

// List types
export type ListType = {
    label: string;
    value: ListTypeValues;
}

export type ListTypeValues = "List" | "Shopping" | "To-Do";