/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {CamelUi} from "../../designer/utils/CamelUi";
import './EIPCard.css';
import {DslMetaModel} from "../utils/DslMetaModel";


interface Props {
  onDslSelect: (dsl: DslMetaModel, parentId: string, position?: number | undefined) => void,
  parentId: string,
  position?: number | undefined,
  element: DslMetaModel,
}

interface State {
  element: DslMetaModel,
}

export class EIPCard extends React.Component<Props, State> {
  public state: State = {
    element: this.props.element,
  };

  selectDsl = (evt: React.MouseEvent, dsl: any) => {
    evt.stopPropagation();
    this.props.onDslSelect.call(this, dsl, this.props.parentId, this.props.position);
  }

  render() {
    const component = this.state.element;
    return (
        <div className='element-card' onClick={event => this.selectDsl(event, component)}>
          <div className='element-card-header'>
            <div className='element-card-icon'>
            {CamelUi.getIconForDsl(component)}
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