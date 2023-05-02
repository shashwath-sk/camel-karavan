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
    Flex,
    FlexItem,
} from '@patternfly/react-core';
import html2canvas from 'html2canvas';
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
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { IntegrationTools } from './IntegrationTools';

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
    isDraggable: boolean
    ongoingDragging: boolean
    cursorCSS: string
    mousePointerCoordinates: { x: number, y: number }
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
        zoom: 1,
        isDraggable: false,
        ongoingDragging: false,
        cursorCSS: 'auto',
        mousePointerCoordinates: { x: 0, y: 0 }
    };

    handleWheel(e: any, zoom: number) {
        e.preventDefault();
        const newZoom = this.state.zoom + (zoom * 0.1) + (zoom * 0.1);
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
        if (prevState.activeTabKey !== this.state.activeTabKey)
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

    getIntegrationTools() {
        return (
            <DrawerPanelContent onResize={width => this.setState({ key: Math.random().toString(1) })}
                style={{ transform: 'initial' }} isResizable hasNoBorder defaultSize={'400px'}
                maxSize={'800px'} minSize={'300px'}>
                <IntegrationTools parentDsl={this.state.parentDsl} onDslSelect={this.state.logic.onDslSelect} parentId={this.state.parentId} position = {this.state.selectedPosition}/>
            </DrawerPanelContent>
        );
    }

    getGraph() {
        const { selectedUuids, integration, key, width, height, top, left } = this.state;
        const routes = CamelUi.getRoutes(integration);
        const routeConfigurations = CamelUi.getRouteConfigurations(integration);
        const contentStyle = {
            transform: `scale(${this.state.zoom})`,
            transformOrigin: `${this.state.mousePointerCoordinates.x} ${this.state.mousePointerCoordinates.y} `,
        };
        return (
            <div ref={this.state.printerRef} className="graph">
                {(this.state.activeTabKey !== -1 || this.state.routeView === 'View All') && !this.state.ongoingDragging &&
                    <DslConnections key={this.state.activeTabKey} height={height} width={width} top={top + 10} left={left - 0} integration={integration} />
                }
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
                            <Flex spaceItems={{ default: 'spaceItemsNone' }} justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginTop: '2px', marginRight: '2px', gap: '2px' }}>
                                <FlexItem>
                                    <Button variant={this.state.cursorCSS === 'zoom-in'? 'primary' :'secondary'} onClick={() => this.setState({ isDraggable: false ,cursorCSS: this.state.cursorCSS === 'zoom-in'? 'auto' : 'zoom-in' })}><FontAwesomeIcon icon={faMagnifyingGlassPlus} /></Button>
                                </FlexItem>
                                <FlexItem>
                                    <Button variant={this.state.cursorCSS === 'zoom-out'? 'primary' :'secondary'} onClick={() => this.setState({ isDraggable: false ,cursorCSS: this.state.cursorCSS === 'zoom-out'? 'auto' :'zoom-out' })}><FontAwesomeIcon icon={faMagnifyingGlassMinus} /></Button>
                                </FlexItem>
                                <FlexItem>
                                    <Button variant={this.state.isDraggable && this.state.cursorCSS === 'all-scroll' ? 'primary' : 'secondary'} onClick={() => this.setState({ isDraggable: !this.state.isDraggable, cursorCSS: this.state.cursorCSS === 'all-scroll'? 'auto' :'all-scroll' })}><FontAwesomeIcon icon={faArrowsUpDownLeftRight} /></Button>
                                </FlexItem>
                            </Flex>
                        </div>
                    }
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
                    <div >
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
                    <div style={{ zIndex: 10 }}>
                        <div style={contentStyle}>
                            <div ref={this.sourceRef}>
                                {
                                    this.state.routeView === 'View All' ?
                                        routes?.map((route: any, index: number) => (
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
                                        ))
                                        :
                                        routes?.map((route: any, index: number) => (
                                            index === this.state.selectedRoutes[this.state.activeTabKey] &&
                                            <Draggable axis='both' disabled={!this.state.isDraggable}
                                                onStart={() => this.setState({ ongoingDragging: true })}
                                                onStop={() => this.setState({ ongoingDragging: false })}
                                                bounds={{ top: 10 }} >
                                                <div style={{ zIndex: 1, cursor: this.state.cursorCSS }}
                                                    onClick={(event) => {
                                                        const x = event.clientX;
                                                        const y = event.clientY;
                                                        if (this.state.cursorCSS === 'zoom-in') {
                                                            this.setState({ mousePointerCoordinates: { x: x, y: y } });
                                                            this.handleWheel(event, 1);
                                                        }
                                                        else if (this.state.cursorCSS === 'zoom-out') {
                                                            this.setState({ mousePointerCoordinates: { x: x, y: y } });
                                                            this.handleWheel(event, -1);
                                                        }
                                                    }} >

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
                                                </div>
                                            </Draggable>
                                        ))}
                            </div>
                        </div>
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
                    <Drawer isExpanded isInline className='designer-body'>
                    {this.state.showSelector === true && this.getIntegrationTools()}
                    {/* {this.getIntegrationTools()} */}
                        <DrawerContent panelContent={this.getPropertiesPanel()}>
                            <DrawerContentBody>
                                {this.getGraph()}
                            </DrawerContentBody>
                        </DrawerContent>
                    </Drawer>
                </div>
                {/* {this.state.showSelector === true && this.getSelectorModal()} */}
                {this.getDeleteConfirmation()}
            </PageSection>
        );
    }
}