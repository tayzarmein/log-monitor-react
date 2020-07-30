/**
 * @jest-environment node
 */

import Axios from 'axios';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('my_test async', () => {
  return Axios.get('http://127.0.0.1:8000/api/', {
    params: {
      type: 'oldgen',
    }
  })
    .then(data => {
      console.log("data=", data.data);
      expect(data.data instanceof Array).toBe(true)
    })
})
