/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { createContext, useState } from "react";
export const DirectoryContext = createContext();

export const DirectoryContextProvider = ({ children }) => {
    const [routesDisplay, setRoutesDisplay] = useState("");
    const [routesWithId, setRoutesWithId] = useState("");
    return (
        <div>
            <DirectoryContext.Provider
                value={{
                    routesDisplay,
                    setRoutesDisplay,
                    routesWithId,
                    setRoutesWithId,
                }}
            >
                {children}
            </DirectoryContext.Provider>
        </div>
    );
};
