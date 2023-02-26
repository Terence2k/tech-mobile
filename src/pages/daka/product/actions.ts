export const increment = () => ({
  type: 'INCREMENT',
});

// action creator
export const decrement = (id) => ({
  type: 'DECREMENT',
  id,
});
