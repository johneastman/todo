import { Button, View } from "react-native";
import {
    CellAction,
    CellSelect,
    CollectionViewCellType,
    QueryCommand,
    QueryPageNavigationProps,
} from "../../types";
import AddUpdateContainer from "../AddUpdateContainer";
import CustomText, { TextSize } from "../core/CustomText";
import { useEffect, useState } from "react";
import CustomPicker from "../core/CustomPicker";
import { navigationTitleOptions } from "../../utils";
import CustomButton from "../core/CustomButton";

export default function QueryPage({
    route,
    navigation,
}: QueryPageNavigationProps): JSX.Element {
    const [query, setQuery] = useState<QueryCommand>();

    useEffect(() => {
        navigation.setOptions({
            ...navigationTitleOptions("Actions"),
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomButton text="Add" onPress={() => {}} />

                    <CustomButton text="Run" onPress={executeQuery} />
                </View>
            ),
        });
    }, [query]);

    const executeQuery = () => {
        console.log(query);
    };

    return (
        <AddUpdateContainer>
            <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
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
                        selectedValue={query?.select}
                        placeholder="What to Select"
                        data={[
                            { label: "All", value: "All" },
                            { label: "None", value: "None" },
                        ]}
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
                        placeholder="What to Do"
                        data={[
                            { label: "Delete", value: "Delete" },
                            { label: "Complete", value: "Complete" },
                            { label: "Incomplete", value: "Incomplete" },
                        ]}
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
