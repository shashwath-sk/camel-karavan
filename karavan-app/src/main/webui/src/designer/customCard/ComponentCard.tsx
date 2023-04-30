/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {camelIcon, CamelUi} from "../../designer/utils/CamelUi";
import {Component} from "karavan-core/lib/model/ComponentModels";
import './ComponentCard.css';

interface Props {
  component: Component,
}

interface State {
  component: Component,
}

export class ComponentCard extends React.Component<Props, State> {
  public state: State = {
    component: this.props.component,
};

  render() {
    const component = this.state.component;
    return (
        <div className='component-card'>
          <div className='component-card-header'>
            <div className='component-card-icon'>
              {CamelUi.getIconFromSource(camelIcon)}
            </div>
          </div>
          <div className='component-card-title'>
              <a style={{color: 'black'}}>
                {component.component.title}
              </a>
          </div>
        </div>
    );
  }
}