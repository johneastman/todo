import { useEffect, useState } from "react";
import CustomMenu from "./CustomMenu";
import { MenuOption } from "../data/data";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { ListPageNavigationProp } from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

interface ListPageViewProps<T> {
    menuOptions: Partial<NativeStackNavigationOptions>;
    items: T[];
    beingEdited: number[];

    children?: React.ReactNode;
}

export default function ListPageView<T>(
    props: ListPageViewProps<T>
): JSX.Element {
    const { menuOptions, items, beingEdited, children } = props;

    let navigation = useNavigation<ListPageNavigationProp>();

    useEffect(() => {
        navigation.setOptions(menuOptions);
    }, [navigation, items, beingEdited]);

    return <>{children}</>;
}
