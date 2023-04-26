import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import React from 'react';

interface Props {
    selectedRoutes: number[]
    handleRoutesCloseClick: (selectedRoutes: number[]) => void
    activeTabKey: number
    handleActiveTabKey: (activeTabKey: number) => void
    routes: any[]
}

const RoutesTab = (props: Props) => {
    const [tabs, setTabs] = React.useState<string[]>([]);
    const tabComponentRef = React.useRef<any>();
    const firstMount = React.useRef(true);

    const onClose = (event: any, tabIndex: string | number) => {
        // if(tabs.length === 1){
        //     props.handleActiveTabKey(-1);
        //     setTabs([]);
        //     props.handleRoutesTabClick([]);
        //     return;
        // }
        // const tabIndexNum = tabIndex as number;
        // setTabs(tabs.filter((tab, index) => index !== tabIndex));
        // props.handleRoutesTabClick(props.selectedRoutes.filter((route) => route !== props.selectedRoutes[tabIndexNum]));
        // const nextTabIndex = tabIndexNum === 0 ? 0 : props.selectedRoutes[0];
        // props.handleActiveTabKey(nextTabIndex);
        // close the tab and set the previous tab as active
        // and check if there is not tab in the  left, then set the active to the right one 

        if (tabs.length === 1) {
            props.handleActiveTabKey(-1);
            setTabs([]);
            props.handleRoutesCloseClick([]);
            return;
        }

        const tabIndexNum = tabIndex as number;
        const nextTabIndex = tabIndexNum === 0 ? 0 : tabIndexNum - 1;
        props.handleActiveTabKey(nextTabIndex);
        setTabs(tabs.filter((tab, index) => index !== tabIndex));
        props.handleRoutesCloseClick(props.selectedRoutes.filter((route) => route !== props.selectedRoutes[tabIndexNum]));

    };

    React.useEffect(() => {
        if (props.selectedRoutes.length === 0) {
            props.handleActiveTabKey(-1);
        } else {
            props.handleActiveTabKey(props.selectedRoutes[0]);
            setTabs(props.selectedRoutes.map((route) => `Route ${props.routes[route].id}`));
        }
    }, [props.selectedRoutes]);

    React.useEffect(() => {
        if (firstMount.current) {
            firstMount.current = false;
            return;
        } else {
            const first = tabComponentRef?.current?.tabList.current.childNodes[props.activeTabKey];
            first && first.firstChild.focus();
        }
    }, [tabs]);

    return (
        props.selectedRoutes.length === 0 ? <></> :
            <Tabs
                activeKey={props.activeTabKey}
                onSelect={(event: any, tabIndex: string | number) => props.handleActiveTabKey(tabIndex as number)}
                onClose={onClose}
                ref={tabComponentRef}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        eventKey={index}
                        aria-label={`Dynamic ${tab}`}
                        title={<TabTitleText>{tab}</TabTitleText>}
                        closeButtonAriaLabel={`Close ${tab}`}
                        isCloseDisabled={false}
                    >
                    </Tab>
                ))}
            </Tabs>
    );
};

export default RoutesTab;