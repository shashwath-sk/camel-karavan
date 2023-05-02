/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { CamelUi} from "../../designer/utils/CamelUi";
import {DslMetaModel} from "../utils/DslMetaModel";
import './ComponentCard.css';

interface Props {
  onDslSelect: (dsl: DslMetaModel, parentId: string, position?: number | undefined) => void,
  parentId: string,
  position?: number | undefined,
  component: DslMetaModel,
}

interface State {
 
  component: DslMetaModel,
}

export class ComponentCard extends React.Component<Props, State> {
  public state: State = {
    component: this.props.component,
};

selectDsl = (evt: React.MouseEvent, dsl: any) => {
  evt.stopPropagation();
  this.props.onDslSelect.call(this, dsl, this.props.parentId, this.props.position);
}

  render() {
    const component = this.state.component;
    return (
        <div className='component-card'  onClick={event => this.selectDsl(event, component)}>
          <div className='component-card-header'>
            <div className='component-card-icon'>
              {CamelUi.getIconForDsl(component)}
            </div>
          </div>
          <div className='component-card-title'>
              <a style={{color: 'black'}}>
                {component.title}
              </a>
          </div>
        </div>
    );
  }
}