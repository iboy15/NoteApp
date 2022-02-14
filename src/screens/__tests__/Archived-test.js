import * as React from 'react';
import renderer from 'react-test-renderer';
import Archived from '../Archived'
import MockedNavigator from '../../navigation/MockedNavigator'

it(`renders correctly`, async () => {
  const tree = await renderer.create(<MockedNavigator  component={Archived} />).toJSON();

  expect(tree).toMatchSnapshot();
});
