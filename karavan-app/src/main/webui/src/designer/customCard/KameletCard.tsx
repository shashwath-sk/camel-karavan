/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {CamelUi} from "../../designer/utils/CamelUi";
import {KameletModel} from "karavan-core/lib/model/KameletModels";
import './KameletCard.css';

interface Props {
  kamelet: KameletModel
}

interface State {
  kamelet: KameletModel,
}

export class KameletCard extends React.Component<Props, State> {
  public state: State = {
    kamelet: this.props.kamelet
};

  render() {
    const kamelet = this.state.kamelet;
    return (
        <div className='card'>
          <div className='card-header'>
            <div className='card-icon'>
              {CamelUi.getIconFromSource(kamelet.icon())}
            </div>
          </div>
          <div className='card-title'>
              <a style={{color: 'black'}}>
                {kamelet.spec.definition.title}
              </a>
          </div>
        </div>
    );
  }
}