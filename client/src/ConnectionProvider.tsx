import { HubConnection } from '@microsoft/signalr';
import React, { useEffect, useMemo } from 'react';
//import { useUpdatePlayerConnectionId } from './services/gameApi';

export interface IConnectionContext {
    connection: HubConnection;
};

const ConnectionContext = React.createContext<IConnectionContext | undefined>(undefined);

export const ConnectionProvider = (props: { connection: HubConnection; children: React.ReactNode }) => {
    const { connection } = props;

    const context = useMemo<IConnectionContext>(() => {        
        return {
            connection
        }
    }, [connection]);

    return <ConnectionContext.Provider value={context}>{props.children}</ConnectionContext.Provider>;
};

export const useConnectionContext = () => {
    const context = React.useContext(ConnectionContext);
    if (context === undefined) {
        throw Error('No context for a connection found. Ensure component tree is wrapped in ConnectionProvider');
    }

    //const { mutate: updateConnectionId } = useUpdatePlayerConnectionId();
    
    // useEffect(() => {
    //     if (context.connection.connectionId !== null) {
    //         var oldConnectionId = sessionStorage.getItem('connectionId');
    //         var newConnectionId = context.connection.connectionId;

    //         if (oldConnectionId && oldConnectionId !== newConnectionId) {
    //             updateConnectionId({ oldConnectionId: oldConnectionId, newConnectionId: newConnectionId })
    //         }

    //         sessionStorage.setItem('connectionId', context.connection.connectionId ?? '')
    //     }
    // }, [context.connection]);

    return context;
};