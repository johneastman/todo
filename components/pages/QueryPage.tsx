import { View, TextInput } from "react-native";
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
import { useContext, useEffect, useState } from "react";
import CustomPicker from "../core/CustomPicker";
import { Color, navigationTitleOptions } from "../../utils";
import CustomButton from "../core/CustomButton";
import CustomError from "../core/CustomError";
import { ListsContext } from "../../contexts/lists.context";
import { SelectListsWhere } from "../../data/reducers/lists.reducer";

type QueryASTAction = "SELECT" | "SET";
interface QueryAST {
    type: QueryASTAction;
}

class Select implements QueryAST {
    type: QueryASTAction = "SELECT";
    collection: string;
    selection: string;
    constructor(collection: string, selection: string) {
        this.collection = collection;
        this.selection = selection;
    }
}

class Set {
    type: QueryASTAction = "SET";
    variable: string;
    value: string;
    constructor(variable: string, value: string) {
        this.variable = variable;
        this.value = value;
    }
}

export default function QueryPage({
    route,
    navigation,
}: QueryPageNavigationProps): JSX.Element {
    const listsContext = useContext(ListsContext);
    const { listsDispatch } = listsContext;

    const [query, setQuery] = useState<string>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        navigation.setOptions({
            ...navigationTitleOptions("Actions"),
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomButton text="Run" onPress={executeQuery} />
                    <CustomButton
                        text="Clear"
                        onPress={() => setQuery(undefined)}
                    />
                </View>
            ),
        });
    }, [query]);

    const executeQuery = () => {
        if (query === undefined) {
            setError("No query specified");
            return;
        }

        const tokens: string[] = query.split(/\s/);
        console.log(tokens);

        let ast: QueryAST[] = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.toLowerCase() === "select") {
                i += 1;
                // TODO: handle unsupported selections
                const collection: string = tokens[i];
                i += 1;
                const selection: string = tokens[i];
                ast.push(new Select(collection, selection));
            } else if (token.toLowerCase() === "set") {
                i += 1;

                const variable = tokens[i];
                i += 1;

                const newValue = tokens[i];
                ast.push(new Set(variable, newValue));
            }
        }

        for (const astElement of ast) {
            switch (astElement.type) {
                case "SELECT": {
                    const { collection, selection } = astElement as Select;

                    
                }
            }
        }
    };

    return (
        <AddUpdateContainer>
            <TextInput
                value={query}
                onChangeText={setQuery}
                multiline
                numberOfLines={5}
                placeholder="Enter a query"
                style={{
                    borderWidth: 1,
                    padding: 10,
                    width: "100%",
                    borderColor: Color.Black,
                    textAlignVertical: "top",
                }}
            />
            <CustomError error={error} />
        </AddUpdateContainer>
    );
}
