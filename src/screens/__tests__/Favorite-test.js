import * as React from 'react';
import renderer from 'react-test-renderer';
import Favorite from '../Favorite'
import MockedNavigator from '../../navigation/MockedNavigator'

it(`renders correctly`, async () => {
  const tree = await renderer.create(<MockedNavigator  component={Favorite} />).toJSON();

  expect(tree).toMatchSnapshot();
});
