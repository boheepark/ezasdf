import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {MemoryRouter as Router} from 'react-router-dom';

import Message from '../Message';


const MESSAGE_TYPES = [
  'success',
  'danger'
];


for(let messageType of MESSAGE_TYPES) {
  describe(`When given a ${messageType} message`, () => {

    const removeMessage = jest.fn();

    const messageProps = {
      messageText: 'Message text.',
      messageType: messageType,
      removeMessage: removeMessage
    };

    it('Message renders properly', () => {
      const wrapper = shallow(<Message {...messageProps} />);
      const element = wrapper.find(`.alert-${messageType}`);
      expect(element.length).toBe(1);
      const span = wrapper.find('span');
      expect(span.length).toBe(2);
      expect(span.get(1).props.children[1]).toContain(
        messageProps.messageText
      );
      const button = wrapper.find('button');
      expect(button.length).toBe(1);
      expect(removeMessage).toHaveBeenCalledTimes(0);
      button.simulate('click');
      expect(removeMessage).toHaveBeenCalledTimes(1);
    });

    test('Message renders a snapshot properly', () => {
      const tree = renderer.create(
        <Message {...messageProps} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

  });
}
