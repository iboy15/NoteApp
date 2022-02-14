import * as React from 'react';
import renderer from 'react-test-renderer';
import Notes from '../Notes'
import MockedNavigator from '../../navigation/MockedNavigator'

it(`renders correctly`, async () => {
  const tree = await renderer.create(<MockedNavigator  component={Notes} />).toJSON();

  expect(tree).toMatchSnapshot();
});
