import { Button, View } from "react-native";
import {
    CellAction,
    CellSelect,
    CollectionViewCellType,
    QueryPageNavigationProps,
} from "../../types";
import AddUpdateContainer from "../AddUpdateContainer";
import CustomText from "../core/CustomText";
import { useState } from "react";

type Command = {
    from?: CollectionViewCellType;
    select?: CellSelect;
    action?: CellAction;
};

export default function QueryPage({
    route,
    navigation,
}: QueryPageNavigationProps): JSX.Element {
    const [query, setQuery] = useState<Command>();

    return (
        <AddUpdateContainer>
            <CustomText
                text={`FROM ${query?.from ?? "location"} SELECT ${
                    query?.select ?? "Cells"
                } AND ${query?.action ?? "Action"}`}
            />
            <View style={{ flexDirection: "column", gap: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <CustomText text="FROM" />
                    <Button
                        title="Lists"
                        onPress={() => setQuery({ ...query, from: "List" })}
                    />
                    <Button
                        title="Items"
                        onPress={() => setQuery({ ...query, from: "Item" })}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <CustomText text="SELECT" />

                    <Button
                        title="All"
                        onPress={() => setQuery({ ...query, select: "All" })}
                    />

                    <Button
                        title="None"
                        onPress={() => setQuery({ ...query, select: "None" })}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <CustomText text="AND" />

                    <Button
                        title="Delete"
                        onPress={() => setQuery({ ...query, action: "Delete" })}
                    />

                    <Button
                        title="Complete"
                        onPress={() =>
                            setQuery({ ...query, action: "Complete" })
                        }
                    />

                    <Button
                        title="Incomplete"
                        onPress={() =>
                            setQuery({ ...query, action: "Incomplete" })
                        }
                    />
                </View>
            </View>
        </AddUpdateContainer>
    );
}
