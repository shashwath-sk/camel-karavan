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
import React, { createRef, RefObject } from 'react';
import {
    Drawer,
    DrawerPanelContent,
    DrawerContent,
    DrawerContentBody,
    Button, Modal,
    PageSection,
} from '@patternfly/react-core';
import html2canvas from 'html2canvas';
import KameletsIcon from "@patternfly/react-icons/dist/js/icons/registry-icon";
import EipIcon from "@patternfly/react-icons/dist/js/icons/topology-icon";
import ComponentsIcon from "@patternfly/react-icons/dist/js/icons/module-icon";
import '../karavan.css';
import './RouteDesigner.css';
import { DslSelector } from "./DslSelector";
import { DslProperties } from "./DslProperties";
import { CamelElement, Integration } from "karavan-core/lib/model/IntegrationDefinition";
import { DslConnections } from "./DslConnections";
import PlusIcon from "@patternfly/react-icons/dist/esm/icons/plus-icon";
import { DslElement } from "./DslElement";
import { CamelUi } from "../utils/CamelUi";
import { CamelDisplayUtil } from "karavan-core/lib/api/CamelDisplayUtil";
import { RouteDesignerLogic } from "./RouteDesignerLogic";
import RoutesTab from './RoutesTabs';
import DropDownWrapper from './DropDownWrapper';

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
    routeView: string
    routeThambnailarr: any
    zoom: number
}

export class RouteDesigner extends React.Component<Props, RouteDesignerState> {

    private sourceRef: RefObject<HTMLDivElement>;
    private targetRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.sourceRef = createRef();
        this.targetRef = createRef();
        // this.state = { zoom: 1 };
        this.handleWheel = this.handleWheel.bind(this);
      }

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
        activeTabKey: -1,
        routeView: 'View All',
        routeThambnailarr: {},
        zoom: 1
    };

    handleWheel(e: any) {
        e.preventDefault();
        const direction1 = e.deltaY > 0 ? -1 : 1;
        const direction2 = e.deltaX > 0 ? -1 : 1;
        const newZoom = this.state.zoom + (direction1 * 0.1) + (direction2 * 0.1);
        this.setState({ zoom: newZoom });
      }

    // function handleRoutesTabCLick which will be passed to RoutesTab 
    // and when set the state in case a new tab is added or removed
    // and then pass this function to RoutesTab
    handleRoutesCloseClick = (selectedRoutes: number[]) => {
        this.setState({ selectedRoutes: selectedRoutes });
        // this.handleActiveTabKey(selectedRoutes[selectedRoutes.length - 1]);
    };

    handleActiveTabKey = (activeTabKey: number) => {
        console.log('before activeTabKey: ' + this.state.activeTabKey)
        this.setState({ activeTabKey: activeTabKey });
        console.log('after activeTabKey: ' + this.state.activeTabKey)
    };
    handleMenuListClick = (index: number) => {
        this.setState({ activeTabKey: index });
    };
    setRouteView = (routeView: string) => {
        this.setState({ routeView: routeView });
    };
    setSelectedRoutes = (selectedRoutes: number[]) => {
        this.setState({ selectedRoutes: selectedRoutes });
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
        if(prevState.activeTabKey !== this.state.activeTabKey)
            html2canvas(this.sourceRef.current as HTMLDivElement).then((canvas) => {
                const image = canvas.toDataURL();
                (this.targetRef.current as HTMLDivElement).style.backgroundImage = `url(${image})`;
                const exampleImg = document.getElementById(this.state.selectedRoutes[this.state.activeTabKey].toString()) as HTMLImageElement;
                exampleImg.setAttribute("src", image);
            });

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
        const contentStyle = {
            transform: `scale(${this.state.zoom})`,
            transformOrigin: '0 0',
          };
        return (
            <div ref={this.state.printerRef} className="graph">
                {(this.state.activeTabKey !== -1 || this.state.routeView === 'View All') &&
                    <DslConnections key={this.state.activeTabKey} height={height} width={width} top={top + 10} left={left - 160} integration={integration} />
                }
                <div className='tools-sec'>
                    <div className='tools-tab'>
                        {/* <DropDownWrapper inputArray={['View All', 'View Tabwise']} val={this.state.routeView} setVal={this.setRouteView} /> */}
                        <div className='eipIcon'>
                            <EipIcon/>
                        </div>
                        <div className='kameletsIcon'>
                            <KameletsIcon />
                        </div>
                        <div className='componentsIcon'>
                            <ComponentsIcon />
                        </div>
                    </div>
                    {/* <div>
                        <hr/>
                    </div> */}
                    <div className='tools-list'>

                    </div>
                </div>
                <div className="flows" data-click="FLOWS" onClick={event => this.state.logic.unselectElement(event)}
                    ref={el => this.state.logic.onResizePage(el)}>
                    {this.state.routeView !== 'View All' &&
                        <div className='routes'>
                            <RoutesTab
                                routes={routes}
                                selectedRoutes={this.state.selectedRoutes}
                                handleRoutesCloseClick={this.handleRoutesCloseClick}
                                activeTabKey={this.state.activeTabKey}
                                handleActiveTabKey={this.handleActiveTabKey}
                            />
                        </div>
                    }
                    <div onWheel={this.handleWheel}>
                    <div style={contentStyle}>
                   <div ref={this.targetRef}>
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
                    </div>
                    </div>
                    </div>
                    <div onWheel={this.handleWheel}>
                    <div style={contentStyle}>
                    <div ref={this.sourceRef}>
                    {routes?.map((route: any, index: number) => (
                        (index === this.state.selectedRoutes[this.state.activeTabKey] || this.state.routeView === 'View All') &&
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
                    </div>
                    </div>
                    </div>
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
                <div className='thumbnail-section'>
                    <div className='thumbnail-header' style={{ zIndex: 100 }}>
                        <DropDownWrapper inputArray={['View All', 'View Tabwise']} val={this.state.routeView} setVal={this.setRouteView} />
                    </div>
                    {
                        this.state.routeView !== 'View All' &&
                        <div className='thumbnail-body scrollable' style={{zIndex: 1}}>
                            {
                                routes.map((route: CamelElement, index: number) => (
                                    <div key={index} className='single-thumbnail' onClick={(event) => {
                                        html2canvas(this.sourceRef.current as HTMLDivElement).then((canvas) => {
                                            const image = canvas.toDataURL();
                                            (this.targetRef.current as HTMLDivElement).style.backgroundImage = `url(${image})`;
                                            const exampleImg = document.getElementById(index.toString()) as HTMLImageElement;
                                            exampleImg.setAttribute("src", image);
                                        });
                                        if(this.state.selectedRoutes.includes(index)){
                                            this.setState({ activeTabKey: this.state.selectedRoutes.indexOf(index)})
                                        }
                                        else{
                                            this.setState({ selectedRoutes: [...this.state.selectedRoutes, index] });
                                        }
                                        this.handleActiveTabKey(this.state.selectedRoutes.indexOf(index));
                                    }}>
                                        <img id={index.toString()} className='single-thumbnail-image' src={''} alt='samim' />
                                    </div>
                                ))
                            }
                            </div>
                    }
                </div>
            </div>);
    }

    render() {
        return (
            <PageSection className="dsl-page" isFilled padding={{ default: 'noPadding' }}>
                <div className="dsl-page-columns">
                    <Drawer isExpanded isInline>
                        <DrawerContent panelContent={this.getPropertiesPanel()}>
                            <DrawerContentBody>
                                {this.getGraph()}
                            </DrawerContentBody>
                        </DrawerContent>
                    </Drawer>
                </div>
                {this.state.showSelector === true && this.getSelectorModal()}
                {this.getDeleteConfirmation()}
            </PageSection>
        );
    }
}