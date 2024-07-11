import { createContext } from "react";
import { Account, AccountAction } from "../data/reducers/account.reducer";

export type AccountContextData = {
    account: Account;
    accountDispatch: (action: AccountAction) => void;
};

export const defaultAccountData: Account = {
    username: undefined,
    isAccountCreationModalVisible: false,
};

export const defaultAccountContextData: AccountContextData = {
    account: defaultAccountData,
    accountDispatch: (action: AccountAction) => {
        throw Error(
            "dispatch method for default account state context is not implemented"
        );
    },
};

export const AccountContext = createContext<AccountContextData>(
    defaultAccountContextData
);
