/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {CamelUi} from "../../designer/utils/CamelUi";
import {DslMetaModel} from "../utils/DslMetaModel";
import './KameletCard.css';

interface Props {
  onDslSelect: (dsl: DslMetaModel, parentId: string, position?: number | undefined) => void,
  parentId: string,
  position?: number | undefined,
  kamelet: DslMetaModel
}

interface State {
  kamelet: DslMetaModel,
}

export class KameletCard extends React.Component<Props, State> {
  public state: State = {
    kamelet: this.props.kamelet
};
selectDsl = (evt: React.MouseEvent, dsl: any) => {
  evt.stopPropagation();
  this.props.onDslSelect.call(this, dsl, this.props.parentId, this.props.position);
}

  render() {
    const kamelet = this.state.kamelet;
    return (
        <div className='card' onClick={event => this.selectDsl(event, kamelet)}>
          <div className='card-header'>
            <div className='card-icon'>
              {CamelUi.getIconForDsl(kamelet)}
            </div>
          </div>
          <div className='card-title'>
              <a style={{color: 'black'}}>
                {kamelet.title}
              </a>
          </div>
        </div>
    );
  }
}