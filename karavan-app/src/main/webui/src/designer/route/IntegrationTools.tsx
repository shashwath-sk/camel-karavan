import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons';
import KameletsIcon from "@patternfly/react-icons/dist/js/icons/registry-icon";
import EipIcon from "@patternfly/react-icons/dist/js/icons/topology-icon";
import ComponentsIcon from "@patternfly/react-icons/dist/js/icons/module-icon";
import {Component} from "karavan-core/lib/model/ComponentModels";
import {ComponentApi} from "karavan-core/lib/api/ComponentApi";
import {KameletModel} from "karavan-core/lib/model/KameletModels";
import {KameletApi} from "karavan-core/lib/api/KameletApi";
import {CamelModelMetadata, ElementMeta} from "karavan-core/lib/model/CamelMetadata";
import { KameletCard } from "../customCard/KameletCard";
import { ComponentCard } from "../customCard/ComponentCard";
import { EIPCard } from "../customCard/EIPCard";
import './IntegrationTools.css';

interface State {
  component?: Component;
  components: Component[],
  kamelet?: KameletModel;
  kamelets: KameletModel[],
  element?: ElementMeta;
  elements: ElementMeta[],
  isKameletClicked: boolean;
  isComponentClicked: boolean;
  isElementClicked: boolean;
  isAllClicked: boolean;
}

export class IntegrationTools extends React.Component {
  public state: State = {
    components: [],
    kamelets: [],
    elements: CamelModelMetadata.sort((a: ElementMeta,b: ElementMeta) => a.name > b.name ? 1 : -1),
    isKameletClicked: false,
    isComponentClicked: false,
    isElementClicked: false,
    isAllClicked: true
  };
  componentDidMount() {
    this.setState({components: ComponentApi.getComponents()})
    this.setState({kamelets: KameletApi.getKamelets()})

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
            kamelets.map((k: KameletModel) => (
              <KameletCard key={k.metadata.name} kamelet={k} />
            ))
          }
          {
            (this.state.isComponentClicked || this.state.isAllClicked) &&
            components.map((c: Component) => (
              <ComponentCard key={c.component.name} component={c} />
            ))
          }
          {
            (this.state.isElementClicked || this.state.isAllClicked) &&
            elements.map((e: ElementMeta) => (
              <EIPCard key={e.name} element={e} />
            ))
          } 
        </div>
      </div>
    );
  }
}