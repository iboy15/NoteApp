import * as React from 'react';
import renderer from 'react-test-renderer';
import NoteCard from '../NoteCard'

it(`renders correctly`, async () => {
  const tree = await renderer.create(<NoteCard onPress={()=>{}}
    body='test'
    title='test'
    color='red'
    created_at={new Date()}
    is_favorit={true}
    setAsFavorite={()=>{}}
    archived={false} />).toJSON();

  expect(tree).toMatchSnapshot();
});
