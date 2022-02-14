import * as React from 'react';
import renderer from 'react-test-renderer';
import ModalAdd from '../ModalAdd'
import MockedNavigator from '../../navigation/MockedNavigator'

it(`renders correctly`, async () => {
  const tree = await renderer.create(<MockedNavigator  component={ModalAdd} />).toJSON();

  expect(tree).toMatchSnapshot();
});
