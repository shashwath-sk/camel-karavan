import React from "react";
import KameletsIcon from "@patternfly/react-icons/dist/js/icons/registry-icon";
import EipIcon from "@patternfly/react-icons/dist/js/icons/topology-icon";
import ComponentsIcon from "@patternfly/react-icons/dist/js/icons/module-icon";
import {Component} from "karavan-core/lib/model/ComponentModels";
import {ComponentApi} from "karavan-core/lib/api/ComponentApi";
import {KameletModel} from "karavan-core/lib/model/KameletModels";
import {KameletApi} from "karavan-core/lib/api/KameletApi";
import {CamelModelMetadata, ElementMeta} from "karavan-core/lib/model/CamelMetadata";
import './IntegrationTools.css';

interface State {
  component?: Component;
  components: Component[],
  kamelet?: KameletModel;
  kamelets: KameletModel[],
  element?: ElementMeta;
  elements: ElementMeta[],
}

export class IntegrationTools extends React.Component {
  public state: State = {
    components: [],
    kamelets: [],
    elements: CamelModelMetadata.sort((a: ElementMeta,b: ElementMeta) => a.name > b.name ? 1 : -1),
  };
  componentDidMount() {
    this.setState({components: ComponentApi.getComponents()})
    this.setState({kamelets: KameletApi.getKamelets()})

  }
  render() {
    const components = this.state.components;
    const kamelets = this.state.kamelets;
    const elements = this.state.elements;
    console.log(components);
    console.log(kamelets);
    console.log(elements);
    return (
      <div className='tools-sec'>
        <div className='tools-tab'>
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
        <div className='tools-list'>

        </div>
      </div>
    );
  }
}