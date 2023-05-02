/* eslint-disable array-callback-return */
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons';
import KameletsIcon from "@patternfly/react-icons/dist/js/icons/registry-icon";
import EipIcon from "@patternfly/react-icons/dist/js/icons/topology-icon";
import ComponentsIcon from "@patternfly/react-icons/dist/js/icons/module-icon";
import {Component} from "karavan-core/lib/model/ComponentModels";
import {KameletModel} from "karavan-core/lib/model/KameletModels";
import {ElementMeta} from "karavan-core/lib/model/CamelMetadata";
import { KameletCard } from "../customCard/KameletCard";
import { ComponentCard } from "../customCard/ComponentCard";
import { EIPCard } from "../customCard/EIPCard";
import {CamelUi} from "../utils/CamelUi";
import {DslMetaModel} from "../utils/DslMetaModel";
import './IntegrationTools.css';

interface State {
  component?: Component;
  components: DslMetaModel[],
  kamelet?: KameletModel;
  kamelets: DslMetaModel[],
  element?: ElementMeta;
  elements: DslMetaModel[],
  isKameletClicked: boolean;
  isComponentClicked: boolean;
  isElementClicked: boolean;
  isAllClicked: boolean;
  parentDsl?: string;
}

interface Props {
  onDslSelect: (dsl: DslMetaModel, parentId: string, position?: number | undefined) => void,
  parentId: string,
  position?: number | undefined,
  parentDsl?: string;
}

export class IntegrationTools extends React.Component <Props, State> {
  public state: State = {
    components: [],
    kamelets: [],
    elements:[] ,
    isKameletClicked: false,
    isComponentClicked: false,
    isElementClicked: false,
    isAllClicked: true,
    parentDsl: this.props.parentDsl,
  };  
  
  componentDidMount() {
      CamelUi.getSelectorModelsForParentFiltered(this.state.parentDsl, '', true)
        .filter((dsl: DslMetaModel) => CamelUi.checkFilter(dsl, ''))
        .map((dsl: DslMetaModel, index: number) => {
            if(dsl.navigation === 'kamelet') {
              this.state.kamelets.push(dsl);
            } else if(dsl.navigation === 'component') {
              this.state.components.push(dsl );
            } else {
              this.state.elements.push(dsl);
            }
          });
  }
  handleKameletClick = () => {
    this.setState({isKameletClicked: true})
    this.setState({isComponentClicked: false})
    this.setState({isElementClicked: false})
    this.setState({isAllClicked: false})
    console.log('kamelet clicked')
  }
  handleComponentClick = () => {
    this.setState({isKameletClicked: false})
    this.setState({isComponentClicked: true})
    this.setState({isElementClicked: false})
    this.setState({isAllClicked: false})
    console.log('component clicked')
  }
  handleElementClick = () => {
    this.setState({isKameletClicked: false})
    this.setState({isComponentClicked: false})
    this.setState({isElementClicked: true})
    this.setState({isAllClicked: false})
    console.log('element clicked')
  }
  handleAllClick = () => {
    this.setState({isKameletClicked: false})
    this.setState({isComponentClicked: false})
    this.setState({isElementClicked: false})
    this.setState({isAllClicked: true})
    console.log('all clicked')
  }
  render() {
    const components = this.state.components;
    const kamelets = this.state.kamelets;
    const elements = this.state.elements;
    return (
      <div className='tools-sec'>
        <div className='tools-tab'>
          <div className="allIcon">
            <FontAwesomeIcon icon={faBorderAll} 
            onClick={this.handleAllClick}
          />
          </div>
          <div className='eipIcon'
            onClick={this.handleElementClick}
          >
              <EipIcon/>
          </div>
          <div className='kameletsIcon'
            onClick={this.handleKameletClick}
          >
            <KameletsIcon />
          </div>
          <div className='componentsIcon'
            onClick={this.handleComponentClick}
          >
            <ComponentsIcon />
          </div>
        </div>
        <div className='tools-list'>
          {
            (this.state.isKameletClicked || this.state.isAllClicked) && 
            kamelets.map((k: DslMetaModel, index:number) => (
              <KameletCard key={index} kamelet={k} onDslSelect = {this.props.onDslSelect} parentId={this.props.parentId} position = {this.props.position}/>
            ))
          }
          {
            (this.state.isComponentClicked || this.state.isAllClicked) &&
            components.map((c: DslMetaModel, index:number) => (
              <ComponentCard key={index} component={c} onDslSelect = {this.props.onDslSelect} parentId={this.props.parentId} position = {this.props.position}/>
            ))
          }
          {
            (this.state.isElementClicked || this.state.isAllClicked) &&
            elements.map((e: DslMetaModel, index:number) => (
              <EIPCard key={index} element={e} onDslSelect = {this.props.onDslSelect} parentId={this.props.parentId} position = {this.props.position}/>
            ))
          } 
        </div>
      </div>
    );
  }
}