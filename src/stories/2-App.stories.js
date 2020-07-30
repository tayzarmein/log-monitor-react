import React from 'react';
import App from '../App';
import OldGenGraph from '../OldGenGraph';

export default {
  title: 'App',
  component: App,
};

export const Main = () => <App />;

// ToStorybook.story = {
//   name: 'to Storybook',
// };

export const oldgengraph = () => {
    return (
        <OldGenGraph />
    )
}
