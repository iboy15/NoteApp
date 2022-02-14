import * as React from 'react';
import renderer from 'react-test-renderer';
import NoteDetail from '../NoteDetail'
import MockedNavigator from '../../navigation/MockedNavigator'

it(`renders correctly`, async () => {
  const tree = await renderer.create(<MockedNavigator  component={NoteDetail} />).toJSON();

  expect(tree).toMatchSnapshot();
});
