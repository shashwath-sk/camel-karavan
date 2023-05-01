/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {CamelUi} from "../../designer/utils/CamelUi";
import {ElementMeta} from "karavan-core/lib/model/CamelMetadata";
import './EIPCard.css';

interface Props {
  element: ElementMeta,
}

interface State {
  element: ElementMeta,
}

export class EIPCard extends React.Component<Props, State> {
  public state: State = {
    element: this.props.element,
  };

  render() {
    const component = this.state.element;
    return (
        <div className='element-card'>
          <div className='element-card-header'>
            <div className='element-card-icon'>
            {CamelUi.getIconForDslName(component.className)}
            </div>
          </div>
          <div className='element-card-title'>
              <a style={{color: 'black'}}>
                {component.title}
              </a>
          </div>
        </div>
    );
  }
}