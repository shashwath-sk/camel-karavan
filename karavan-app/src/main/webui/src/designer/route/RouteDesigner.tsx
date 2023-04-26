/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {
    Drawer,
    DrawerPanelContent,
    DrawerContent,
    DrawerContentBody,
    Button, Modal,
    PageSection,
    Menu,
    MenuContent,
    MenuList,
    MenuItem,
} from '@patternfly/react-core';
import '../karavan.css';
import './RouteDesigner.css';
import {DslSelector} from "./DslSelector";
import {DslProperties} from "./DslProperties";
import {CamelElement, Integration} from "karavan-core/lib/model/IntegrationDefinition";
import {DslConnections} from "./DslConnections";
import PlusIcon from "@patternfly/react-icons/dist/esm/icons/plus-icon";
import {DslElement} from "./DslElement";
import {CamelUi} from "../utils/CamelUi";
import {CamelDisplayUtil} from "karavan-core/lib/api/CamelDisplayUtil";
import {RouteDesignerLogic} from "./RouteDesignerLogic";
import RoutesTab from './RoutesTabs';

interface Props {
    onSave?: (integration: Integration, propertyOnly: boolean) => void
    integration: Integration
    dark: boolean
}

export interface RouteDesignerState {
    logic: RouteDesignerLogic
    integration: Integration
    selectedStep?: CamelElement
    showSelector: boolean
    showDeleteConfirmation: boolean
    deleteMessage: string
    parentId: string
    parentDsl?: string
    selectedPosition?: number
    showSteps: boolean
    selectedUuids: string[]
    key: string
    width: number
    height: number
    top: number
    left: number
    clipboardSteps: CamelElement[]
    shiftKeyPressed?: boolean
    ref?: any
    printerRef?: any
    propertyOnly: boolean
    selectorTabIndex?: string | number
    selectedRoutes: number[]
    activeTabKey: number
}

export class RouteDesigner extends React.Component<Props, RouteDesignerState> {

    public state: RouteDesignerState = {
        logic: new RouteDesignerLogic(this),
        integration: CamelDisplayUtil.setIntegrationVisibility(this.props.integration, undefined),
        showSelector: false,
        showDeleteConfirmation: false,
        deleteMessage: '',
        parentId: '',
        showSteps: true,
        selectedUuids: [],
        clipboardSteps: [],
        key: '',
        width: 1000,
        height: 1000,
        top: 0,
        left: 0,
        ref: React.createRef(),
        printerRef: React.createRef(),
        propertyOnly: false,
        selectedRoutes: [],
        activeTabKey: -1
    };

    // function handleRoutesTabCLick which will be passed to RoutesTab 
    // and when set the state in case a new tab is added or removed
    // and then pass this function to RoutesTab
    handleRoutesCloseClick = (selectedRoutes: number[]) => {
        this.setState({ selectedRoutes: selectedRoutes });
        this.handleActiveTabKey(selectedRoutes[selectedRoutes.length - 1]);
    };

    handleActiveTabKey = (activeTabKey: number) => {
        this.setState({ activeTabKey: activeTabKey });
    };
    handleMenuListClick = (index: number) => {
        this.setState({ activeTabKey: index });
    };

    componentDidMount() {
        this.state.logic.componentDidMount();
    }

    componentWillUnmount() {
        this.state.logic.componentWillUnmount();
    }

    handleResize = (event: any) => {
        return this.state.logic.handleResize(event);
    };

    handleKeyDown = (event: KeyboardEvent) => {
        return this.state.logic.handleKeyDown(event);
    };

    handleKeyUp = (event: KeyboardEvent) => {
        return this.state.logic.handleKeyUp(event);
    };

    componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<RouteDesignerState>, snapshot?: any) => {
        return this.state.logic.componentDidUpdate(prevState, snapshot);
    };

    getSelectorModal() {
        return (
            <DslSelector
                isOpen={this.state.showSelector}
                onClose={() => this.state.logic.closeDslSelector()}
                dark={this.props.dark}
                parentId={this.state.parentId}
                parentDsl={this.state.parentDsl}
                showSteps={this.state.showSteps}
                position={this.state.selectedPosition}
                tabIndex={this.state.selectorTabIndex}
                onDslSelect={this.state.logic.onDslSelect} />);
    }

    getDeleteConfirmation() {
        const htmlContent: string = this.state.deleteMessage;
        return (<Modal
            className="modal-delete"
            title="Confirmation"
            isOpen={this.state.showDeleteConfirmation}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            actions={[
                <Button key="confirm" variant="primary" onClick={e => this.state.logic.deleteElement()}>Delete</Button>,
                <Button key="cancel" variant="link"
                    onClick={e => this.setState({ showDeleteConfirmation: false })}>Cancel</Button>
            ]}
            onEscapePress={e => this.setState({ showDeleteConfirmation: false })}>
            <div>
                {htmlContent}
            </div>
        </Modal>);
    }

    getPropertiesPanel() {
        return (
            <DrawerPanelContent onResize={width => this.setState({ key: Math.random().toString(1) })}
                style={{ transform: 'initial' }} isResizable hasNoBorder defaultSize={'400px'}
                maxSize={'800px'} minSize={'300px'}>
                <DslProperties ref={this.state.ref}
                    integration={this.state.integration}
                    step={this.state.selectedStep}
                    onIntegrationUpdate={this.state.logic.onIntegrationUpdate}
                    onPropertyUpdate={this.state.logic.onPropertyUpdate}
                    isRouteDesigner={true}
                    dark={this.props.dark} />
            </DrawerPanelContent>
        );
    }

    getGraph() {
        const { selectedUuids, integration, key, width, height, top, left } = this.state;
        const routes = CamelUi.getRoutes(integration);
        const routeConfigurations = CamelUi.getRouteConfigurations(integration);
        return (
            <div ref={this.state.printerRef} className="graph">
                {this.state.activeTabKey !== -1 &&
                    <DslConnections key={this.state.activeTabKey} height={height} width={width} top={top + 10} left={left - 215} integration={integration} />
                    // <DslConnections key={this.state.activeTabKey} height={height} width={width} top={top+10} left={left} integration={integration}/>
                }
                <div className='thumbnail-section'>
                    <div className='thumbnail-header'>
                        <h1> Routes </h1>
                    </div>
                    <Menu className='scrollable' >
                        <MenuContent menuHeight='90%'>
                            <MenuList>
                                {
                                    routes?.map((route: CamelElement, index: number) => (
                                        <MenuItem key={index} itemId={index} className='single-thumbnail'
                                            onClick={
                                                (event) => {
                                                    console.log('index: ', index);
                                                    if (!this.state.selectedRoutes.includes(index)) {
                                                        this.setState({ selectedRoutes: [...this.state.selectedRoutes, index] });
                                                        this.handleActiveTabKey(this.state.selectedRoutes.length - 1);
                                                        return;
                                                    }
                                                    this.handleActiveTabKey(this.state.selectedRoutes.indexOf(index));
                                                }
                                            } >
                                        </MenuItem>
                                    ))
                                }
                            </MenuList>
                        </MenuContent>
                    </Menu>
                </div>
                <div className="flows" data-click="FLOWS" onClick={event => this.state.logic.unselectElement(event)}
                    ref={el => this.state.logic.onResizePage(el)}>
                    <div className='routes'>
                        <RoutesTab
                            selectedRoutes={this.state.selectedRoutes}
                            handleRoutesCloseClick={this.handleRoutesCloseClick}
                            activeTabKey={this.state.activeTabKey}
                            handleActiveTabKey={this.handleActiveTabKey}
                        />
                    </div>
                    {routeConfigurations?.map((routeConfiguration, index: number) => (
                        <DslElement key={routeConfiguration.uuid + key}
                            integration={integration}
                            openSelector={this.state.logic.openSelector}
                            deleteElement={this.state.logic.showDeleteConfirmation}
                            selectElement={this.state.logic.selectElement}
                            moveElement={this.state.logic.moveElement}
                            selectedUuid={selectedUuids}
                            inSteps={false}
                            position={index}
                            step={routeConfiguration}
                            parent={undefined} />
                    ))}
                    {routes?.map((route: any, index: number) => (
                        index == this.state.selectedRoutes[this.state.activeTabKey] &&
                        <DslElement key={route.uuid + key}
                            integration={integration}
                            openSelector={this.state.logic.openSelector}
                            deleteElement={this.state.logic.showDeleteConfirmation}
                            selectElement={this.state.logic.selectElement}
                            moveElement={this.state.logic.moveElement}
                            selectedUuid={selectedUuids}
                            inSteps={false}
                            position={index}
                            step={route}
                            parent={undefined} />
                    ))}
                    <div className="add-flow">
                        <Button
                            variant={routes.length === 0 ? 'primary' : 'secondary'}
                            icon={<PlusIcon />}
                            onClick={e => this.state.logic.openSelector(undefined, undefined)}>Create route
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<PlusIcon />}
                            onClick={e => this.state.logic.createRouteConfiguration()}>Create configuration
                        </Button>
                    </div>
                </div>
                {/* </div> */}
            </div>);
    }

    render() {
        return (
            <PageSection className="dsl-page" isFilled padding={{ default: 'noPadding' }}>
                <div className="dsl-page-columns">
                    <Drawer isExpanded isInline>
                        <DrawerContent panelContent={this.getPropertiesPanel()}>
                            <DrawerContentBody>{this.getGraph()}</DrawerContentBody>
                        </DrawerContent>
                    </Drawer>
                </div>
                {this.state.showSelector === true && this.getSelectorModal()}
                {this.getDeleteConfirmation()}
            </PageSection>
        );
    }
}