import { View } from "react-native";
import {
    CellAction,
    CellSelect,
    CollectionViewCellType,
    QueryCommand,
    QueryPageNavigationProps,
    SelectionValue,
} from "../../types";
import AddUpdateContainer from "../AddUpdateContainer";
import CustomText, { TextSize } from "../core/CustomText";
import { useEffect, useState } from "react";
import CustomPicker from "../core/CustomPicker";
import { navigationTitleOptions } from "../../utils";
import CustomButton from "../core/CustomButton";
import CustomError from "../core/CustomError";

export default function QueryPage({
    route,
    navigation,
}: QueryPageNavigationProps): JSX.Element {
    const [query, setQuery] = useState<QueryCommand>({
        from: undefined,
        select: undefined,
        action: undefined,
    });
    const [error, setError] = useState<string>();

    useEffect(() => {
        navigation.setOptions({
            ...navigationTitleOptions("Actions"),
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomButton
                        text="Add"
                        onPress={() => {
                            throw Error("method not implemented");
                        }}
                        disabled={true}
                    />

                    <CustomButton text="Run" onPress={executeQuery} />
                </View>
            ),
        });
    }, [query]);

    const commonSelect: SelectionValue<CellSelect>[] = [
        { label: "All", value: "All" },
        { label: "None", value: "None" },
    ];

    const commonAction: SelectionValue<CellAction>[] = [
        { label: "Delete", value: "Delete" },
    ];

    const listSelect: SelectionValue<CellSelect>[] = [
        ...commonSelect,
        { label: "Generic List", value: "Generic List" },
        { label: "Shopping List", value: "Shopping List" },
        { label: "To-Do List", value: "To-Do List" },
        { label: "Ordered To-Do List", value: "Ordered To-Do List" },
    ];

    const listAction: SelectionValue<CellAction>[] = [...commonAction];

    const itemSelect: SelectionValue<CellSelect>[] = [
        ...commonSelect,
        { label: "Locked", value: "Locked" },
        { label: "Unlocked", value: "Unlocked" },
        { label: "Complete", value: "Complete" },
        { label: "Incomplete", value: "Incomplete" },
    ];

    const itemAction: SelectionValue<CellAction>[] = [
        ...commonAction,
        { label: "Complete", value: "Complete" },
        { label: "Incomplete", value: "Incomplete" },
        { label: "Lock", value: "Lock" },
        { label: "Unlock", value: "Unlock" },
    ];

    const executeQuery = () => {
        if (query.from === undefined) {
            setError("Select where to query from");
            return;
        }

        if (query.select === undefined) {
            setError(`Select what ${query.from}s are selected`);
            return;
        }

        if (query.action === undefined) {
            setError("Choose an action");
            return;
        }

        setError(undefined);

        console.log(query);
    };

    const getCurrentSelect = (): SelectionValue<CellSelect>[] => {
        switch (query?.from) {
            case "List":
                return listSelect;
            case "Item":
                return itemSelect;
            default:
                return [];
        }
    };

    const getCurrentAction = (): SelectionValue<CellAction>[] => {
        switch (query?.from) {
            case "List":
                return listAction;
            case "Item":
                return itemAction;
            default:
                return [];
        }
    };

    const currentSelect: SelectionValue<CellSelect>[] = getCurrentSelect();
    const currentAction: SelectionValue<CellAction>[] = getCurrentAction();

    return (
        <AddUpdateContainer>
            <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
                <CustomError error={error} />

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <CustomText
                        text="FROM"
                        size={TextSize.Medium}
                        style={{ flex: 1 }}
                    />

                    <CustomPicker
                        selectedValue={query?.from}
                        placeholder="Where to Select"
                        data={[
                            { label: "List", value: "List" },
                            { label: "Item", value: "Item" },
                        ]}
                        onSelect={(value: CollectionViewCellType) =>
                            setQuery({ ...query, from: value })
                        }
                        style={{ flex: 2 }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <CustomText
                        text="SELECT"
                        size={TextSize.Medium}
                        style={{ flex: 1 }}
                    />

                    <CustomPicker
                        disabled={query?.from === undefined}
                        selectedValue={query?.select}
                        placeholder="What to Select"
                        data={currentSelect}
                        onSelect={(value: CellSelect) =>
                            setQuery({ ...query, select: value })
                        }
                        style={{ flex: 2 }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <CustomText
                        text="AND"
                        size={TextSize.Medium}
                        style={{ flex: 1 }}
                    />

                    <CustomPicker
                        selectedValue={query?.action}
                        disabled={query?.from === undefined}
                        placeholder="What to Do"
                        data={currentAction}
                        onSelect={(value: CellAction) =>
                            setQuery({ ...query, action: value })
                        }
                        style={{ flex: 2 }}
                    />
                </View>
            </View>
        </AddUpdateContainer>
    );
}
