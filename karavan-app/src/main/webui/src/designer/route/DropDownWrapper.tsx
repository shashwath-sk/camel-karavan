import React from 'react';

import { Dropdown, DropdownToggle, DropdownItem, DropdownSeparator } from '@patternfly/react-core';

interface Props {
    setVal: (val: any) => void
    val: any
    inputArray: any[]
}

export const DropDownWrapper= (props:Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-primary');
    if(element)
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const dropdownItems = [
    props.inputArray.map((item) => (
        <DropdownItem key={item} onClick={() => props.setVal(item)}>
            {item}
        </DropdownItem>
    ))
  ];

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle id="toggle-primary" toggleVariant="primary" onToggle={onToggle} style={{width: '150px'}}>
          {props.val}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};

export default DropDownWrapper;